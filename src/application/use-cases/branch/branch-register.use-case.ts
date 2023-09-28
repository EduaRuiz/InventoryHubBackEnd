import { BranchDomainModel } from '@domain-models';
import { Observable, tap } from 'rxjs';
import { INewBranchDomainDto } from '@domain-dtos';
import { IBranchDomainService } from '@domain-services';
import { BranchRegisteredEventPublisher } from '@domain-publishers';
import { ValueObjectBase, ValueObjectErrorHandler } from '@sofka/bases';
import {
  BranchLocationValueObject,
  BranchNameValueObject,
} from '@value-objects/branch';
import { ValueObjectException } from '@sofka/exceptions';
import { IUseCase } from '@sofka/interfaces';

export class BranchRegisterUseCase
  extends ValueObjectErrorHandler
  implements IUseCase<INewBranchDomainDto, BranchDomainModel>
{
  constructor(
    private readonly branch$: IBranchDomainService,
    private readonly branchRegisteredEventPublisher: BranchRegisteredEventPublisher,
  ) {
    super();
  }

  execute(
    registerBranchDto: INewBranchDomainDto,
  ): Observable<BranchDomainModel> {
    registerBranchDto.name = registerBranchDto.name?.trim().toUpperCase();
    const newBranch = this.entityFactory(registerBranchDto);
    return this.branch$.createBranch(newBranch).pipe(
      tap((branch: BranchDomainModel) => {
        this.eventHandler(branch);
      }),
    );
  }

  private createValueObjects(
    command: INewBranchDomainDto,
  ): ValueObjectBase<any>[] {
    const location = new BranchLocationValueObject(command.location);
    const name = new BranchNameValueObject(command.name);
    return [location, name];
  }

  private validateValueObjects(valueObjects: ValueObjectBase<any>[]) {
    this.cleanErrors();
    for (const valueObject of valueObjects) {
      if (valueObject.hasErrors()) {
        this.setErrors(valueObject.getErrors());
      }
    }
    if (this.hasErrors()) {
      throw new ValueObjectException(
        'Existen algunos errores en los datos ingresados',
        this.getErrors(),
      );
    }
  }

  private entityFactory(
    registerBranchDto: INewBranchDomainDto,
  ): BranchDomainModel {
    const valueObjects = this.createValueObjects(registerBranchDto);
    this.validateValueObjects(valueObjects);
    return {
      products: [],
      users: [],
      location:
        registerBranchDto.location?.city +
        ' ' +
        registerBranchDto.location?.country,
      name: registerBranchDto.name,
    };
  }

  private eventHandler(branch: BranchDomainModel): void {
    this.branchRegisteredEventPublisher.response = branch;
    this.branchRegisteredEventPublisher.publish();
  }
}
