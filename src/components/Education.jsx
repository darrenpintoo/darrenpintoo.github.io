
const Education = ({ data }) => {
    return (
        <div style={{ marginTop: '2rem' }}>
            {data.map((edu, index) => (
                <div key={index} style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{edu.university}</h3>
                        <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{edu.date}</span>
                    </div>
                    <div style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>{edu.location}</div>
                    <div style={{ color: 'var(--accent-blue)', marginTop: '0.2rem' }}>{edu.degree}</div>
                    {edu.courses && (
                        <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '0.5rem' }}>
                            Relevant Coursework: {edu.courses.join(', ')}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Education;
