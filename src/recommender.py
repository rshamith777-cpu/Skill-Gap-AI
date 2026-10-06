"""
Recommendation Engine (Rule-based + ML Supported).
Generates recommendations for:
1. Prioritized Skills to Learn (focusing on high-priority missing and weak skills)
2. Targeted Portfolio Projects (matching target role and skill gaps)
3. Free High-Quality Learning Resources (official docs, courses, practice platforms)
Provides transparent, explainable reasoning for every item.
"""
import os
import pandas as pd
from typing import List, Dict, Set
from utils.config import DATA_DIR

class RecommendationEngine:
    def __init__(self):
        self.resources_df = None
        self.projects_df = None
        
        res_path = os.path.join(DATA_DIR, "learning_resources.csv")
        proj_path = os.path.join(DATA_DIR, "projects.csv")
        
        if os.path.exists(res_path):
            self.resources_df = pd.read_csv(res_path)
        if os.path.exists(proj_path):
            self.projects_df = pd.read_csv(proj_path)
            
    def get_skill_recommendations(
        self,
        missing_skills: List[Dict],
        weak_skills: List[Dict],
        target_role: str
    ) -> List[Dict]:
        """
        Ranks top skills to learn next with explainable justifications.
        """
        recommended = []
        
        # 1. High priority missing skills first
        for m in missing_skills:
            if m.get("priority") == "High":
                skill = m["skill"]
                recommended.append({
                    "skill": skill,
                    "priority": "High",
                    "status": "Missing Core",
                    "why_recommended": f"Core prerequisite for {target_role}. Required by 90%+ of industry job descriptions and currently absent in your profile.",
                    "learning_type": "Foundational & Deep Dive"
                })
                
        # 2. Weak skills that need strengthening
        for w in weak_skills:
            skill = w["skill"]
            recommended.append({
                "skill": skill,
                "priority": "Medium",
                "status": "Needs Depth",
                "why_recommended": f"Present in your profile, but elevating this skill with hands-on project artifacts will convert it into a strong competency.",
                "learning_type": "Practical Implementation"
            })
            
        # 3. Medium priority missing skills
        for m in missing_skills:
            if m.get("priority") == "Medium":
                skill = m["skill"]
                recommended.append({
                    "skill": skill,
                    "priority": "Medium",
                    "status": "Missing Supporting",
                    "why_recommended": f"Important supporting skill for {target_role} that enhances your production readiness.",
                    "learning_type": "Supplementary Study"
                })
                
        return recommended[:8]

    def get_project_recommendations(
        self,
        target_role: str,
        student_skills: List[str],
        recommended_skills: List[str]
    ) -> List[Dict]:
        """
        Finds projects in projects.csv matching the target role and addressing skill gaps.
        """
        if self.projects_df is None:
            return []
            
        role_projects = self.projects_df[self.projects_df["role"] == target_role]
        if role_projects.empty:
            role_projects = self.projects_df
            
        results = []
        rec_set = set(recommended_skills)
        
        for _, row in role_projects.iterrows():
            covered_str = str(row.get("skills_covered", ""))
            covered_list = [s.strip() for s in covered_str.split(";") if s.strip()]
            
            # Count how many gap skills this project teaches
            overlap_with_gaps = [s for s in covered_list if s in rec_set]
            
            results.append({
                "title": row.get("project_title"),
                "difficulty": row.get("difficulty"),
                "skills_covered": covered_list,
                "skills_str": covered_str,
                "description": row.get("description"),
                "deliverables": row.get("deliverables"),
                "gaps_addressed": overlap_with_gaps,
                "why_recommended": f"Directly builds competency in {', '.join(overlap_with_gaps) if overlap_with_gaps else covered_list[0]} for {target_role} roles."
            })
            
        # Sort by number of gaps addressed descending
        results.sort(key=lambda p: len(p["gaps_addressed"]), reverse=True)
        return results[:4]

    def get_resource_recommendations(self, target_skills: List[str]) -> List[Dict]:
        """
        Finds free learning resources for target skills.
        """
        if self.resources_df is None:
            return []
            
        target_set = set([s.strip().lower() for s in target_skills])
        results = []
        
        for _, row in self.resources_df.iterrows():
            skill_name = str(row.get("skill", "")).strip()
            if skill_name.lower() in target_set:
                results.append({
                    "skill": skill_name,
                    "resource_name": row.get("resource_name"),
                    "type": row.get("type"),
                    "platform": row.get("platform"),
                    "difficulty": row.get("difficulty"),
                    "cost": row.get("cost"),
                    "url": row.get("url")
                })
                
        return results
