import streamlit as st

st.set_page_config(page_title="Case Summary", layout="wide")


st.sidebar.title("Navigation")
if st.sidebar.button("📘 Case Summary"):
    st.switch_page("app.py")
if st.sidebar.button("🧑‍⚖️ Juror Questions"):
    st.switch_page("pages/questions.py")

st.title("📘 Case Summary: Carter v. QuantumTech Solutions, Inc.")
st.subheader("Jurisdiction: U.S. District Court, State of Franklin")
st.markdown("### Case Type: **Wrongful Termination – Alleged Racial Discrimination**")

st.write("""
**Jamal Carter**, a 42-year-old African American software engineer, worked at QuantumTech Solutions, Inc. 
for eight years before being laid off as part of a company-wide reduction in force (RIF) that affected ten 
employees in his department. QuantumTech asserts that the layoffs were based on business needs, while Carter 
contends that his termination was racially motivated.
""")

st.markdown("---")
st.header("📌 Background Facts")
st.write("""
- QuantumTech Solutions, Inc. is a mid-sized technology firm specializing in AI-driven analytics.  
- The company employs 250 people, 15% of whom are African American.  
- Carter joined in **2016**, was promoted to **Senior Software Engineer in 2021**, and received consistently high reviews.  
- In March 2024, the company announced budget cuts leading to a RIF affecting 50 employees.  
- Carter and four teammates were laid off; Carter was the only African American on his 10-person team.
""")

st.markdown("---")
st.header("🧑‍⚖️ Plaintiff’s Case")
st.write("""
Carter argues that his termination was racially motivated and presents the following claims:

- He was a high performer with relevant skills.  
- Less qualified white engineers were retained.  
- His project was active and not obsolete.  
- **40% of laid-off employees were Black**, although Black employees made up 15% of the workforce.  
- Only **10% of rehired employees** were Black.  
- His supervisor made racially insensitive remarks, showing a culture of bias.
""")

st.markdown("---")
st.header("🏢 Defendant’s Case")
st.write("""
QuantumTech argues that:

- Layoffs were based on business needs and restructuring.  
- Layoff selection was **random within teams**.  
- Some Black employees were retained.  
- Rehiring was based solely on qualifications.  
- Racial disparity resulted from differing skillsets, not discrimination.
""")

st.markdown("---")
st.header("🗣️ Witness Testimony Summaries")

st.subheader("📍 Plaintiff’s Witnesses")
st.write("""
**Jamal Carter (Plaintiff):** Claims high performance, unequal treatment, and recalls racially insensitive remarks by his supervisor.

**Dr. Lisa Greene (Employment Data Expert):** Found statistically significant racial disparities in layoffs and rehiring, suggesting bias.

**Monica Alvarez (Former HR Manager):** Testifies that leadership downplayed diversity and implied Black candidates were less qualified.
""")

st.subheader("📍 Defendant’s Witnesses")
st.write("""
**Mark Donovan (VP of HR):** Asserts layoffs were determined by business needs, applied randomly, and race played no role.

**Ashley Reed (Carter’s Supervisor):** Denies racial bias; states decisions followed objective criteria.

**Dr. Robert Ellis (Defense Expert):** Found no significant racial disparities; argues differences arose from skill levels and job requirements.
""")

st.markdown("---")
st.markdown("### 👉 Click **Next** to continue to the Questions page.")

if st.button("Next ➡️"):
    st.switch_page("pages/questions.py")
