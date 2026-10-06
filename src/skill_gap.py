"""
Skill Gap Analysis and Prioritization Engine.
Identifies:
- Strong Skills (Present with high evidence or core alignment)
- Weak Skills (Foundational/partially covered skills needing depth)
- Missing Skills (Required by role but absent from student profile)
Assigns explainable priorities: High (Core to role), Medium (Key supporting), Low (Elective/tooling).
"""
from typing import List, Dict, Set, Tuple

class SkillGapAnalyzer:
    def __init__(self, role_database: Dict[str, Dict] = None):
        self.role_database = role_database or {}
        
    def analyze_gaps(
        self,
        student_skills: List[str],
        target_role: str,
        evidence_counts: Dict[str, int] = None,
        projects: List[str] = None
    ) -> Dict:
        """
        Analyzes student skill gaps against target role specifications.
        """
        evidence_counts = evidence_counts or {}
        student_set = set(student_skills)
        role_info = self.role_database.get(target_role, {})
        
        core_skills = [s.strip() for s in role_info.get("core_skills", []) if s.strip()]
        supporting_skills = [s.strip() for s in role_info.get("supporting_skills", []) if s.strip()]
        all_required = list(dict.fromkeys(core_skills + supporting_skills))
        
        strong_skills = []
        weak_skills = []
        missing_skills = []
        
        # Check all skills present in profile
        for skill in student_skills:
            mentions = evidence_counts.get(skill, 1)
            is_core = skill in core_skills
            is_supporting = skill in supporting_skills
            
            # If student has the skill and it's either core with high evidence or practiced
            if is_core and mentions >= 2:
                strong_skills.append({
                    "skill": skill,
                    "status": "Strong",
                    "reason": f"Core competency for {target_role} with strong evidence in your profile.",
                    "evidence_level": "High"
                })
            elif is_core or is_supporting:
                # If core but single mention or supporting
                if mentions >= 2:
                    strong_skills.append({
                        "skill": skill,
                        "status": "Strong",
                        "reason": f"Supporting skill for {target_role} backed by multiple profile mentions.",
                        "evidence_level": "Medium"
                    })
                else:
                    weak_skills.append({
                        "skill": skill,
                        "status": "Weak",
                        "priority": "Medium",
                        "reason": f"Present in profile but needs deeper project evidence to meet {target_role} benchmarks.",
                        "evidence_level": "Developing"
                    })
            else:
                # Skill outside direct curriculum for this role, but still strong general foundation
                strong_skills.append({
                    "skill": skill,
                    "status": "Strong",
                    "reason": "Valuable technical skill providing interdisciplinary breadth.",
                    "evidence_level": "General"
                })
                
        # Analyze missing skills
        for skill in all_required:
            if skill not in student_set:
                is_core = skill in core_skills
                priority = "High" if is_core else "Medium"
                missing_skills.append({
                    "skill": skill,
                    "status": "Missing",
                    "priority": priority,
                    "is_core": is_core,
                    "reason": f"Mandatory core requirement for {target_role}" if is_core else f"Important supporting requirement for {target_role}"
                })
                
        # Sort missing skills: High priority first, then alphabetical
        missing_skills.sort(key=lambda x: (0 if x["priority"] == "High" else 1, x["skill"]))
        
        return {
            "target_role": target_role,
            "strong_skills": strong_skills,
            "weak_skills": weak_skills,
            "missing_skills": missing_skills,
            "counts": {
                "strong": len(strong_skills),
                "weak": len(weak_skills),
                "missing": len(missing_skills),
                "high_priority_missing": sum(1 for m in missing_skills if m["priority"] == "High")
            }
        }
