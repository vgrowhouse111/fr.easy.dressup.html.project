import { h } from 'preact';

interface Car {
  id: number;
  name: string;
  year: number;
  engine: string;
  hp: number;
  features: string[];
}

interface Props {
  cars: Car[];
}

const CarCards: preact.FunctionComponent<Props> = ({ cars }) => {
  if (cars.length === 0) {
    return <p>No cars found. Add some cars to see them here!</p>;
  }

  return (
    <div className="car-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem',
      padding: '1rem 0'
    }}>
      {cars.map(car => (
        <div 
          key={car.id} 
          className="car-card" 
          style={{
            background: '#2a2a2a',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s ease-in-out',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'none')}
        >
          <h3 style={{
            margin: '0 0 0.5rem 0',
            color: '#f0f0f0',
            fontSize: '1.25rem'
          }}>
            {car.name} <span style={{ color: '#888' }}>({car.year})</span>
          </h3>
          <p style={{ margin: '0.5rem 0', color: '#ccc' }}>
            <strong>Engine:</strong> {car.engine}
          </p>
          <p style={{ margin: '0.5rem 0', color: '#ccc' }}>
            <strong>Horsepower:</strong> {car.hp} HP
          </p>
          {car.features.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <p style={{ margin: '0.5rem 0 0.25rem 0', color: '#aaa', fontSize: '0.9rem' }}>
                <strong>Features:</strong>
              </p>
              <ul style={{
                margin: '0.25rem 0 0 0',
                paddingLeft: '1.25rem',
                color: '#ddd',
                fontSize: '0.9rem'
              }}>
                {car.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CarCards;
