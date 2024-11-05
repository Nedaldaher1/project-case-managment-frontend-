
export interface DialogEditCasePublicProps {
    id: number;
    case_Number: string;
    defendantName: string;
    imprisonmentDuration: number;
    startDate: Date;
    member_Location: string;
    memberNumber: string;
    type_case: string;
    children: React.ReactNode;
    
   }


export interface DialogEditCasePriavteProps {
    caseID : number;
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
    isReadyForDecision: boolean;
    actionOther: string;

}

  