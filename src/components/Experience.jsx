
const Experience = ({ data }) => {
    return (
        <div className="experience-list" style={{ marginTop: '2rem' }}>
            {data.map((exp, index) => (
                <div key={index} style={{
                    marginBottom: '3rem',
                    borderLeft: '2px solid var(--border-color, #333)',
                    paddingLeft: '2rem',
                    position: 'relative'
                }}>
                    {/* Dot for timeline */}
                    <div style={{
                        position: 'absolute',
                        left: '-6px',
                        top: '0',
                        width: '10px',
                        height: '10px',
                        backgroundColor: 'var(--accent)',
                        borderRadius: '50%'
                    }}></div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1.4rem', margin: 0 }}>{exp.company}</h3>
                        <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{exp.date}</span>
                    </div>

                    <div style={{ fontSize: '1.1rem', color: 'var(--accent-blue)', marginBottom: '0.5rem' }}>
                        {exp.role}
                    </div>
                    <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontStyle: 'italic' }}>
                        {exp.location}
                    </div>

                    <ul style={{ listStyle: 'disc', color: 'var(--text-primary)', marginLeft: '1rem', lineHeight: '1.7' }}>
                        {exp.description.map((item, i) => (
                            <li key={i} style={{ marginBottom: '0.5rem' }}>{item}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default Experience;
