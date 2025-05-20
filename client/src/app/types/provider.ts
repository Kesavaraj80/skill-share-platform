export interface ISkill {
  category: string;
  experience: string;
  workNature: "onsite" | "online";
  hourlyRate: number;
  currency: "USD" | "AUD" | "SGD" | "INR";
}

export interface ISkillsList extends ISkill {
  id: string;
}

export interface ISkillResponse {
  data: ISkillsList[];
}
