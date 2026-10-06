"""
NLP and Text Preprocessing utilities for SkillGapAI.
"""
import re
import os
import pandas as pd
from utils.config import DATA_DIR

def load_skill_dictionary():
    """
    Loads canonical skill dictionary and synonym mapping from data/skills.csv.
    """
    skills_path = os.path.join(DATA_DIR, "skills.csv")
    if not os.path.exists(skills_path):
        return {}, {}
    
    df = pd.read_csv(skills_path)
    canonical_skills = list(df["skill"].dropna().unique())
    synonym_map = {}
    skill_category_map = {}
    
    for _, row in df.iterrows():
        canonical = str(row["skill"]).strip()
        category = str(row["category"]).strip()
        skill_category_map[canonical] = category
        
        # Self mapping (lowercased)
        synonym_map[canonical.lower()] = canonical
        
        # Synonyms
        if pd.notna(row.get("synonyms")):
            syns = str(row["synonyms"]).split("|")
            for syn in syns:
                s = syn.strip().lower()
                if s:
                    synonym_map[s] = canonical
                    
    return canonical_skills, synonym_map, skill_category_map

def clean_text(text: str) -> str:
    """
    Standardizes raw text: lowercases, removes non-alphanumeric noise while
    preserving technical tokens like c++, scikit-learn, etc.
    """
    if not text:
        return ""
    text = text.lower()
    # Normalize special tokens
    text = re.sub(r'c\+\+', 'cpp', text)
    text = re.sub(r'c\#', 'csharp', text)
    # Remove excessive punctuation
    text = re.sub(r'[\r\n\t]+', ' ', text)
    text = re.sub(r'[^\w\s\+\-\/\.]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def normalize_skill_name(raw_name: str, synonym_map: dict) -> str:
    """
    Maps a raw skill token or synonym to its canonical form.
    """
    cleaned = raw_name.strip().lower()
    if cleaned in synonym_map:
        return synonym_map[cleaned]
    # Check without spaces or dashes
    cleaned_simple = re.sub(r'[\s\-_]', '', cleaned)
    for syn, canonical in synonym_map.items():
        if re.sub(r'[\s\-_]', '', syn) == cleaned_simple:
            return canonical
    return raw_name.strip().title()
