
const Projects = ({ data }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            {data.map((project, index) => (
                <div key={index} style={{
                    backgroundColor: 'var(--bg-secondary)',
                    padding: '2rem',
                    borderRadius: '8px',
                    border: '1px solid #333',
                    transition: 'transform 0.2s ease, border-color 0.2s ease'
                }}
                    className="project-card"
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.3rem' }}>{project.title}</h3>
                        {project.stats && (
                            <span style={{ fontSize: '0.8rem', backgroundColor: 'var(--accent)', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                                Top Pick
                            </span>
                        )}
                    </div>

                    <div style={{ color: 'var(--accent-blue)', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {project.subtitle}
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontFamily: 'monospace' }}>
                        {project.date}
                    </div>

                    <div style={{ marginBottom: '1.5rem', minHeight: '80px' }}>
                        {project.description.map((item, i) => (
                            <p key={i} style={{ marginBottom: '0.5rem', fontSize: '0.95rem', color: '#ccc' }}>• {item}</p>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {project.tech.map((tech, tIndex) => (
                            <span key={tIndex} style={{
                                fontSize: '0.8rem',
                                border: '1px solid #444',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '12px',
                                color: 'var(--text-secondary)'
                            }}>
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Projects;
