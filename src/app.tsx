import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import FibonacciLinks from './components/FibonacciLinks';
import CarCards from './components/CarCards';
import './app.css';

interface Folder {
  id: number;
  name: string;
  url?: string;
  views: number;
  isPrivate: boolean;
  createdAt: string;
}

interface Car {
  id: number;
  name: string;
  year: number;
  engine: string;
  hp: number;
  features: string[];
}

export function App() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState({
    folders: true,
    cars: true,
  });
  const [error, setError] = useState({
    folders: '',
    cars: '',
  });

  useEffect(() => {
    // Fetch folders
    fetch('/api/folders')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch folders');
        return res.json();
      })
      .then(data => {
        setFolders(data);
        setIsLoading(prev => ({ ...prev, folders: false }));
      })
      .catch(err => {
        console.error('Error fetching folders:', err);
        setError(prev => ({ ...prev, folders: 'Failed to load folders' }));
        setIsLoading(prev => ({ ...prev, folders: false }));
      });

    // Fetch cars
    fetch('/api/cars')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch cars');
        return res.json();
      })
      .then(data => {
        setCars(data);
        setIsLoading(prev => ({ ...prev, cars: false }));
      })
      .catch(err => {
        console.error('Error fetching cars:', err);
        setError(prev => ({ ...prev, cars: 'Failed to load cars' }));
        setIsLoading(prev => ({ ...prev, cars: false }));
      });
  }, []);

  return (
    <div className="app-container" style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      color: '#f0f0f0',
      fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
      lineHeight: 1.5,
      fontWeight: 400,
    }}>
      <header style={{
        textAlign: 'center',
        marginBottom: '3rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid #333',
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          margin: '0 0 0.5rem',
          background: 'linear-gradient(90deg, #00ff88, #00a2ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 800,
        }}>
          Fibonacci Car Explorer
        </h1>
        <p style={{
          color: '#aaa',
          margin: '0',
          fontSize: '1.1rem',
        }}>
          Explore cars in a 3D Fibonacci spiral
        </p>
      </header>

      <main>
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: '1.75rem',
            margin: '0 0 1.5rem',
            color: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <span>3D Folder Visualization</span>
            {isLoading.folders && (
              <span style={{
                fontSize: '0.8em',
                color: '#888',
                fontWeight: 'normal',
              }}>
                (Loading...)
              </span>
            )}
          </h2>
          
          {error.folders ? (
            <div style={{
              background: 'rgba(255, 50, 50, 0.1)',
              borderLeft: '4px solid #ff4d4d',
              padding: '1rem',
              margin: '1rem 0',
              borderRadius: '4px',
            }}>
              {error.folders}
            </div>
          ) : (
            <div style={{
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
              marginBottom: '1.5rem',
              backgroundColor: '#1e1e1e',
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {folders.length > 0 ? (
                <FibonacciLinks folders={folders} />
              ) : (
                <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>
                  No folders to display. Add some folders to see them in the 3D visualization.
                </p>
              )}
            </div>
          )}
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '1rem',
          }}>
            <button 
              onClick={() => {
                // Add a sample folder
                fetch('/api/folders', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: `Folder ${folders.length + 1}`,
                    url: `https://example.com/folder-${folders.length + 1}`,
                    isPrivate: false,
                  }),
                })
                .then(res => res.json())
                .then(newFolder => {
                  setFolders(prev => [newFolder, ...prev]);
                })
                .catch(err => console.error('Error adding folder:', err));
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#00a2ff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0088cc'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#00a2ff'}
            >
              Add Sample Folder
            </button>
          </div>
        </section>

        <section>
          <h2 style={{
            fontSize: '1.75rem',
            margin: '0 0 1.5rem',
            color: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <span>Car Collection</span>
            {isLoading.cars && (
              <span style={{
                fontSize: '0.8em',
                color: '#888',
                fontWeight: 'normal',
              }}>
                (Loading...)
              </span>
            )}
          </h2>
          
          {error.cars ? (
            <div style={{
              background: 'rgba(255, 50, 50, 0.1)',
              borderLeft: '4px solid #ff4d4d',
              padding: '1rem',
              margin: '1rem 0',
              borderRadius: '4px',
            }}>
              {error.cars}
            </div>
          ) : (
            <CarCards cars={cars} />
          )}
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '1.5rem',
          }}>
            <button 
              onClick={() => {
                // Add a sample car
                const sampleCars = [
                  {
                    name: 'Tesla Model S',
                    year: 2023,
                    engine: 'Electric',
                    hp: 1020,
                    features: ['Autopilot', 'Ludicrous Mode', 'Glass Roof']
                  },
                  {
                    name: 'Porsche 911 Turbo S',
                    year: 2023,
                    engine: '3.7L Twin-Turbo Flat-6',
                    hp: 640,
                    features: ['AWD', 'Active Aero', 'Sport Exhaust']
                  },
                  {
                    name: 'Ferrari SF90 Stradale',
                    year: 2023,
                    engine: '4.0L Twin-Turbo V8 + 3 Electric Motors',
                    hp: 986,
                    features: ['Hybrid', 'AWD', 'E-Diff']
                  }
                ];
                
                const randomCar = sampleCars[Math.floor(Math.random() * sampleCars.length)];
                
                fetch('/api/cars', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(randomCar),
                })
                .then(res => res.json())
                .then(newCar => {
                  setCars(prev => [...prev, newCar]);
                })
                .catch(err => console.error('Error adding car:', err));
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#00a2ff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0088cc'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#00a2ff'}
            >
              Add Sample Car
            </button>
          </div>
        </section>
      </main>
      
      <footer style={{
        marginTop: '4rem',
        paddingTop: '2rem',
        borderTop: '1px solid #333',
        textAlign: 'center',
        color: '#888',
        fontSize: '0.9rem',
      }}>
        <p>Fibonacci Car Explorer &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
