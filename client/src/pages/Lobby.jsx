import React from 'react';
import { Link } from "react-router-dom";

function Lobby() {
    return (
        <div style={{ marginInline: '2rem'  , padding: '2rem' }}>
            <h1 style={{ textAlign: 'center' }}>Lobby</h1>
            <h2 style={{  margin: '1rem', padding: '1rem'  }}>Code blocks for practice:</h2>
            <div>
                <Link to={'room/Arrays'}>
                    <div style={{ border: '1px solid black', margin: '2rem'  , padding: '2rem' }}>
                        <h2>Arrays</h2>
                        <h5>Return the First Element in an Array</h5>
                    </div>
                </Link>
                <Link to={'room/Numbers'}>
                    <div style={{ border: '1px solid black', margin: '2rem' , padding: '2rem' }}>
                        <h2>Numbers</h2>
                        <h5>Return the Sum of Two Numbers</h5>
                    </div>
                </Link>
                <Link to={'room/Strings'}>
                    <div style={{ border: '1px solid black', margin: '2rem' , padding: '2rem' }}>
                        <h2>Strings</h2>
                        <h5>Length of a String</h5>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Lobby