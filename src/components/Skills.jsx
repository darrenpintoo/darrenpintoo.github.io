
const Skills = ({ data }) => {
    return (
        <div style={{ marginTop: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ color: 'var(--accent-blue)', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
                    Languages
                </h4>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {data.languages.map((skill, i) => (
                        <span key={i} style={{ fontSize: '1rem' }}>{skill} <span style={{ color: '#444' }}>•</span></span>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ color: 'var(--accent-blue)', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
                    Frameworks & Libraries
                </h4>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {data.frameworks.map((skill, i) => (
                        <span key={i} style={{ fontSize: '1rem' }}>{skill} <span style={{ color: '#444' }}>•</span></span>
                    ))}
                </div>
            </div>

            <div>
                <h4 style={{ color: 'var(--accent-blue)', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
                    Developer Tools
                </h4>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {data.tools.map((skill, i) => (
                        <span key={i} style={{ fontSize: '1rem' }}>{skill} <span style={{ color: '#444' }}>•</span></span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Skills;
