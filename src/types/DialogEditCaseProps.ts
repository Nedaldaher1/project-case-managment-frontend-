
export interface DialogEditCasePublicProps {
    id: number;
    case_Number: string;
    defendantName: string;
    imprisonmentDuration: number;
    startDate: Date;
    memberNumber: string;
    type_case: string;
    children: React.ReactNode;
    year: string;
    issuingDepartment: string;
    investigationID: string;
    officeNumber: string;


}


export interface DialogEditCasePriavteProps {
    caseID: number;
    children: React.ReactNode;
    caseNumber: string;
    memberNumber: string;
    accusation: string;
    defendantQuestion: string;
    officerQuestion: string;
    victimQuestion: string;
    witnessQuestion: string;
    technicalReports: string;
    caseReferral: string;
    actionOther: string;
    actionType: string;
    officerName: string;
    reportType: string;

}

