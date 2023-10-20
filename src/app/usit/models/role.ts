export class Role {
  roleId!: number;

  roleName!: string;

  roleNo!: string;

  description!: string;

  status!: string;

  remarks!: string;
  ///info:info=[];
  //hero = new Employee();
  addedBy = localStorage.getItem('userid');
  updatedBy = localStorage.getItem('userid');
}
