import React, { useState } from 'react';
import './styles.css';

const App = () => {
  const [form, setForm] = useState({
    fullName: '', email: '', mobile: '', gender: '', location: '',
    university: '', course: '', year: '', cgpa: '',
    interests: [], domains: [], portfolio: '', availability: '',
    workType: '', whyJoin: '', questions: ''
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    const updated = checked
      ? [...form[name], value]
      : form[name].filter((item) => item !== value);
    setForm({ ...form, [name]: updated });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
    } else {
      alert('Upload PDF only');
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in form) {
      if (Array.isArray(form[key])) {
        form[key].forEach(item => data.append(key, item));
      } else {
        data.append(key, form[key]);
      }
    }
    data.append('resume', file);

    try {
      const res = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      alert(result.message);
      setForm({
        fullName: '', email: '', mobile: '', gender: '', location: '',
        university: '', course: '', year: '', cgpa: '',
        interests: [], domains: [], portfolio: '', availability: '',
        workType: '', whyJoin: '', questions: ''
      });
      setFile(null);
    } catch (err) {
      alert('Error submitting form');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20, maxWidth: 600, margin: 'auto' }}>
      <h2>Registration Form</h2>

      <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required /><br />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required /><br />
      <input name="mobile" placeholder="Mobile" value={form.mobile} onChange={handleChange} required /><br />

      <select name="gender" value={form.gender} onChange={handleChange}>
        <option value="">Select Gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Others</option>
      </select><br />

      <input name="location" placeholder="Location" value={form.location} onChange={handleChange} /><br />
      <input name="university" placeholder="University" value={form.university} onChange={handleChange} required /><br />
      <input name="course" placeholder="Course" value={form.course} onChange={handleChange} required /><br />
      <input name="year" placeholder="Current Year/Status" value={form.year} onChange={handleChange} /><br />
      <input name="cgpa" placeholder="CGPA/Percentage (Optional)" value={form.cgpa} onChange={handleChange} /><br />

      <label>Interested In:</label>
      <div className="checkbox-group">
        <label><input type="checkbox" name="interests" value="Internship" onChange={handleCheckboxChange} /> Internship</label>
        <label><input type="checkbox" name="interests" value="Placement" onChange={handleCheckboxChange} /> Placement</label>
        <label><input type="checkbox" name="interests" value="Project-Based Collaboration" onChange={handleCheckboxChange} /> Project-Based Collaboration</label>
        <label><input type="checkbox" name="interests" value="Learning Programs" onChange={handleCheckboxChange} /> Learning Programs</label>
      </div><br />

      <label>Preferred Domain(s):</label>
      <div className="checkbox-group">
        <label><input type="checkbox" name="domains" value="Data Science" onChange={handleCheckboxChange} /> Data Science</label>
        <label><input type="checkbox" name="domains" value="Web Development" onChange={handleCheckboxChange} /> Web Development</label>
        <label><input type="checkbox" name="domains" value="AI/ML" onChange={handleCheckboxChange} /> AI/ML</label>
        <label><input type="checkbox" name="domains" value="Digital Marketing" onChange={handleCheckboxChange} /> Digital Marketing</label>
        <label><input type="checkbox" name="domains" value="Business Development" onChange={handleCheckboxChange} /> Business Development</label>
        <label><input type="checkbox" name="domains" value="Biotechnology Research" onChange={handleCheckboxChange} /> Biotechnology Research</label>
        <label><input type="checkbox" name="domains" value="Project Management" onChange={handleCheckboxChange} /> Project Management</label>
        <label><input type="checkbox" name="domains" value="Any Suitable Role" onChange={handleCheckboxChange} /> Any Suitable Role</label>
      </div><br />

      <input name="portfolio" placeholder="LinkedIn/GitHub/Portfolio Link (Optional)" value={form.portfolio} onChange={handleChange} /><br />

      <label>Upload Resume (PDF only):</label>
      <input type="file" accept=".pdf" onChange={handleFileChange} required /><br />

      <label>Are you available for an on-spot interview?</label>
      <select name="availability" value={form.availability} onChange={handleChange}>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select><br />

      <label>Preferred Working Type:</label>
      <select name="workType" value={form.workType} onChange={handleChange}>
        <option value="Full-time">Full-time</option>
        <option value="Part-time">Part-time</option>
        <option value="Remote">Remote</option>
        <option value="Hybrid">Hybrid</option>
      </select><br />

      <textarea name="whyJoin" placeholder="Why do you want to join Rajnitech Foundation?" value={form.whyJoin} onChange={handleChange} /><br />
      <textarea name="questions" placeholder="Any Questions or Expectations?" value={form.questions} onChange={handleChange} /><br />

      <button type="submit">Submit</button>
    </form>
  );
};

export default App;
