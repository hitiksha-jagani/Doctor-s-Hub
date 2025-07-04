import React from "react";

const HomePage = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '60px',
        maxWidth: '1400px',
        margin: '0 auto',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        
      }}
    >
      <div style={{ flex: 1, paddingRight: '40px' }}>
        <h1
          style={{
            fontSize: '42px',
            color: '#2c3e50',
            marginBottom: '20px',
          }}
        >
          Welcome to Our Healthcare Platform
        </h1>
        <p style={{ fontSize: '20px', color: '#555' }}>
          Book appointments with top doctors online. Seamless, secure, and fast.
        </p>
      </div>

      <div style={{ flex: 1, textAlign: 'center' }}>
        <img
          src="https://www.code-brew.com/wp-content/uploads/2021/14/doctor2.png"
          alt="Doctor"
          style={{
            width: '120%',
            height: '660px',
            marginTop: '100px',
            // maxWidth: '650px',
            borderRadius: '16px',
            // boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
        />
      </div>
    </div>
  );
};

export default HomePage;
