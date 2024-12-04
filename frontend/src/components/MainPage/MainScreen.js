import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MainScreen.module.css';

const MainPage = () => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  const handleGenerate = (method) => {
    navigate('/ideal-team', { state: { method } });
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pokemon Team Synergy Analyzer</h1>
      <div className={styles.logoImage} ></div>
      <div className={styles.buttonContainer}>
        <button onClick={() => navigateTo('/input-team')} className={styles.inputButton}>Personalized Team</button>
        <button onClick={() => handleGenerate('maxHeap')} className={styles.heapButton}>Generate: maxHeap</button>
        <button onClick={() => handleGenerate('map')} className={styles.mapButton}>Generate: map</button>
      </div>
    </div>
  );
};

export default MainPage;
