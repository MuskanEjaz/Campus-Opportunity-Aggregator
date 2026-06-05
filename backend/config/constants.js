const DEPARTMENTS = [
    { id: 1, name: 'Computer Science' },
    { id: 2, name: 'Business Administration' },
    { id: 3, name: 'Electrical Engineering' },
    { id: 4, name: 'Media Studies' },
    { id: 5, name: 'Mathematics' },
    { id: 6, name: 'Psychology' },
];

const CATEGORIES = [
    { id: 1, name: 'Internship' },
    { id: 2, name: 'Scholarship' },
    { id: 3, name: 'Hackathon' },
    { id: 4, name: 'Research' },
    { id: 5, name: 'Course' },
    { id: 6, name: 'Exchange Program' },
    { id: 7, name: 'Competition' },
    { id: 8, name: 'Workshop' },
];

function getDeptName(dept_id) {
    return DEPARTMENTS.find(d => d.id === Number(dept_id))?.name || 'Unknown';
}

function getCategoryName(category_id) {
    return CATEGORIES.find(c => c.id === Number(category_id))?.name || 'Unknown';
}

module.exports = { DEPARTMENTS, CATEGORIES, getDeptName, getCategoryName };
