import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';
import { loadCakes } from '../../api';

const useStyles = makeStyles({
  root: {
    width: '90vw',
    '@media (min-width: 800px)': {
      width: 750,
      margin: 'auto',
    },
  },
  'cake-item': {
    listStyleType: 'none',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
  },
  'image-holder': {
    width: 70,
    marginRight: 10,
  },
  'cake-image': {
    maxWidth: 60,
    maxHeight: 60,
    width: 'auto',
    height: 'auto',
    margin: 'auto',
  },
  'cake-name': {
    margin: 0,
  },
});

export default () => {
  const [loading, setLoading] = useState(false);
  const [cakes, setCakes] = useState([]);
  const [error, setError] = useState(false);
  const classes = useStyles();

  const fetchCakes = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await loadCakes();
      setCakes(response);
    } catch (e) {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCakes();
  }, []);

  if (error) {
    return (<div>Sorry there was an error loading the cakes</div>);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!cakes || cakes.length < 1) {
    return <div>Sorry, there are no cakes to peruse</div>;
  }

  return (
    <div className={classes.root}>
      <ol>
        {cakes.map((cake) => (
          <li key={cake.id} className={classes['cake-item']}>
            <Link to={`/${cake.id}`} className={classes.link}>
              <div className={classes['image-holder']}>
                <img className={classes['cake-image']} src={cake.imageUrl} alt={cake.name} />
              </div>
              <h2 className={classes['cake-name']}>{cake.name}</h2>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
};
