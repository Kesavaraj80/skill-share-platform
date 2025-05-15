import Skill, { ISkillDoc } from "./skill.model";

export async function create(data: Partial<ISkillDoc>): Promise<ISkillDoc> {
  const skill = new Skill(data);
  return skill.save();
}

export async function findById(id: string): Promise<ISkillDoc | null> {
  return Skill.findById(id);
}

export async function findByProviderId(
  providerId: string
): Promise<ISkillDoc[]> {
  return Skill.find({ providerId });
}

export async function update(
  id: string,
  data: Partial<ISkillDoc>
): Promise<ISkillDoc | null> {
  return Skill.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteSkill(id: string): Promise<ISkillDoc | null> {
  return Skill.findByIdAndDelete(id);
}

export async function findByCategory(category: string): Promise<ISkillDoc[]> {
  return Skill.find({ category });
}

export async function findByProviderAndCategory(
  providerId: string,
  category: string
): Promise<ISkillDoc[]> {
  return Skill.find({ providerId, category });
}
