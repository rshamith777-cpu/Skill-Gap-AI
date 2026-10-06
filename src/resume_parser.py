"""
Local Resume Document Parser with Structured Field Extraction.
Extracts clean plain text from PDF, DOCX, and TXT files locally, and extracts:
- Candidate Name
- Degree / Academic Stream
- Graduation Year
- Practical Experience (Years)
- Projects List
- Skills & Evidence
"""
import io
import re
from typing import Tuple, Dict, Any, List

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extracts text from PDF bytes using pypdf."""
    try:
        from pypdf import PdfReader
        reader = PdfReader(io.BytesIO(file_bytes))
        extracted = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                extracted.append(text)
        return "\n".join(extracted).strip()
    except Exception as e:
        return f"Error extracting PDF: {str(e)}"

def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extracts text from DOCX bytes using python-docx."""
    try:
        import docx
        doc = docx.Document(io.BytesIO(file_bytes))
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
        for table in doc.tables:
            for row in table.rows:
                row_text = " | ".join([cell.text.strip() for cell in row.cells if cell.text.strip()])
                if row_text:
                    paragraphs.append(row_text)
        return "\n".join(paragraphs).strip()
    except Exception as e:
        return f"Error extracting DOCX: {str(e)}"

def extract_text_from_txt(file_bytes: bytes) -> str:
    """Extracts text from TXT bytes with fallback encoding detection."""
    for enc in ["utf-8", "latin-1", "cp1252"]:
        try:
            return file_bytes.decode(enc).strip()
        except UnicodeDecodeError:
            continue
    return file_bytes.decode("utf-8", errors="ignore").strip()

def extract_profile_details(raw_text: str) -> Dict[str, Any]:
    """
    Intelligently extracts candidate name, degree, graduation year,
    experience, projects, and certifications count from resume text.
    """
    details: Dict[str, Any] = {
        "name": "",
        "degree": "",
        "gradYear": None,
        "experienceYears": 0.0,
        "projects": "",
        "certificationsCount": 0
    }

    if not raw_text:
        return details

    lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
    cleaned_lower = raw_text.lower()

    # 1. Candidate Name:
    # First 5 lines typically contain the candidate's name (excluding emails, phone numbers, urls, labels)
    for line in lines[:6]:
        # Skip if contains email, phone, github, linkedin, or header words
        if "@" in line or "http" in line.lower() or "github" in line.lower() or "linkedin" in line.lower():
            continue
        if re.search(r'\b(resume|curriculum|vitae|contact|summary|profile|phone|mobile)\b', line, re.IGNORECASE):
            continue
        # If line has 2 to 4 words of alphabets, likely a name
        clean_words = re.findall(r'[A-Za-z]+', line)
        if 2 <= len(clean_words) <= 4 and len(line) <= 40:
            details["name"] = " ".join(clean_words).title()
            break

    # 2. Degree / Education matching
    degree_patterns = [
        (r'\b(m\.?tech|master of technology|m\.?s)\b.*?\b(data science|ai|artificial intelligence)\b', "M.Tech Data Science & AI"),
        (r'\b(b\.?tech|bachelor of technology|b\.?e)\b.*?\b(ai|artificial intelligence|data science)\b', "B.Tech Artificial Intelligence and Data Science"),
        (r'\b(b\.?e\.?|b\.?tech|bachelor of engineering|bachelor of technology)\b.*?\b(computer science|cse|cs)\b', "B.E. Computer Science and Engineering"),
        (r'\b(b\.?tech|information technology|it)\b', "B.Tech Information Technology"),
        (r'\b(electronics|ece|communication)\b', "B.E. Electronics and Communication"),
        (r'\b(bca|mca|computer applications)\b', "BCA / MCA Computer Applications"),
        (r'\bcomputer science\b', "B.E. Computer Science and Engineering"),
    ]
    for pattern, deg in degree_patterns:
        if re.search(pattern, cleaned_lower):
            details["degree"] = deg
            break

    # 3. Graduation Year (years 2020-2030)
    year_matches = re.findall(r'\b(202[0-9])\b', raw_text)
    if year_matches:
        # Take the highest plausible graduation year
        years = [int(y) for y in year_matches]
        future_or_recent = [y for y in years if 2022 <= y <= 2028]
        if future_or_recent:
            details["gradYear"] = max(future_or_recent)
        else:
            details["gradYear"] = max(years)

    # 4. Experience Years Extraction
    exp_matches = re.findall(r'(\d+(?:\.\d+)?)\s*(?:\+)?\s*(?:years?|yrs?)\s*(?:of)?\s*(?:experience|exp|work)?', cleaned_lower)
    if exp_matches:
        try:
            val = float(exp_matches[0])
            if val <= 15:
                details["experienceYears"] = min(val, 4.0)
        except ValueError:
            pass
    elif "intern" in cleaned_lower or "internship" in cleaned_lower:
        details["experienceYears"] = 0.5

    # 5. Projects Extraction
    # Search for project section
    project_section_match = re.search(r'(?:projects|academic projects|key projects)[\s:]*\n(.*?)(?=\n\s*(?:skills|education|experience|certifications|awards|interests|summary)|$)', raw_text, re.DOTALL | re.IGNORECASE)
    project_items: List[str] = []
    if project_section_match:
        section_text = project_section_match.group(1).strip()
        # Find bullet points or titles
        for p_line in section_text.splitlines():
            p_line = p_line.strip()
            if not p_line:
                continue
            if p_line.startswith(("-", "•", "*", "1.", "2.", "3.", "4.")):
                clean_p = re.sub(r'^[-•*\d\.\s]+', '', p_line).strip()
                if 10 <= len(clean_p) <= 80:
                    project_items.append(clean_p)
            elif len(p_line) <= 60 and not p_line.endswith("."):
                project_items.append(p_line)
    
    if project_items:
        details["projects"] = "\n".join(project_items[:4])
    else:
        # Fallback: look for lines mentioning system / app / model / dashboard
        projs = []
        for line in lines:
            if re.search(r'\b(prediction|classifier|system|dashboard|application|api|pipeline|website|platform)\b', line, re.IGNORECASE):
                if 10 <= len(line.strip()) <= 70 and not line.strip().startswith("http"):
                    clean_l = re.sub(r'^[-•*\d\.\s]+', '', line).strip()
                    projs.append(clean_l)
        if projs:
            details["projects"] = "\n".join(list(dict.fromkeys(projs))[:3])

    # 6. Certifications count
    cert_matches = re.findall(r'\b(certified|certification|certificate|coursera|udemy|nptel|aws certified)\b', cleaned_lower)
    if cert_matches:
        details["certificationsCount"] = min(len(cert_matches), 5)

    return details

def parse_resume_file(filename: str, file_bytes: bytes) -> Tuple[bool, str, Dict[str, Any], str]:
    """
    Parses an uploaded resume file locally and extracts plain text + structured candidate details.
    Returns: (success: bool, extracted_text: str, details: dict, message: str)
    """
    if not file_bytes:
        return False, "", {}, "File is empty (0 bytes). Please upload a valid resume."
        
    lower_name = filename.lower()
    text = ""
    
    if lower_name.endswith(".pdf"):
        text = extract_text_from_pdf(file_bytes)
    elif lower_name.endswith(".docx"):
        text = extract_text_from_docx(file_bytes)
    elif lower_name.endswith(".txt"):
        text = extract_text_from_txt(file_bytes)
    else:
        return False, "", {}, f"Unsupported file extension for '{filename}'. Allowed: .pdf, .docx, .txt"
        
    if not text or len(text.strip()) < 20:
        return False, text, {}, "Extracted text is very short or could not be read from file."
        
    details = extract_profile_details(text)
    return True, text, details, f"Successfully parsed {len(text)} characters from {filename} locally."
