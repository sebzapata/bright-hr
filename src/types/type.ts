export interface IAbsence {
  id: number;
  startDate: string;
  days: number;
  absenceType: string;
  employee: {
    firstName: string;
    lastName: string;
    id: string;
  };
  approved: true;
}

export interface IConflict {
  conflicts: boolean;
}
