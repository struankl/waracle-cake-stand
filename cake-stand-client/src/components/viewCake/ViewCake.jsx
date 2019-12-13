import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Star, StarBorder, HelpOutline } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import {
  loadCake, deleteCake, updateCake, addCake,
} from '../../api';

const useStyles = makeStyles({
  root: {
    width: '90vw',
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    paddingTop: 10,
    '& img': {
      maxHeight: 250,
      maxWidth: '90vw',
      height: 'auto',
      width: 'auto',
      flexGrow: 0,
      alignSelf: 'center',
    },
    '@media (min-width: 800px)': {
      width: 750,
      flexDirection: 'row',
      '& img': {
        width: 250,
        height: 'auto',
        alignSelf: 'start',
      },
    },
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    paddingLeft: 10,
    '& > *': {
      marginTop: 10,
    },
  },
  'hide-image': {
    position: 'relative',
    left: -10000,
  },
  'image-placeholder': {
    height: 150,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& svg': {
      fontSize: 125,
    },
  },
  'button-bar': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  'button-group': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    '& > *': {
      marginLeft: 10,
    },
  },
});

const emptyCake = {
  name: '',
  comment: '',
  imageUrl: '',
  yumFactor: 0,
};

export default () => {
  const { cakeId } = useParams();
  const [loading, setLoading] = useState(false);
  const [cake, setCake] = useState(emptyCake);
  const [error, setError] = useState(false);
  const [editable, setEditable] = useState(!cakeId);
  const [tempStars, setTempStars] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const history = useHistory();
  const classes = useStyles();

  const onMouseEntersStar = ({ currentTarget }) => {
    if (!editable) {
      return;
    }
    setTempStars(parseInt(currentTarget.dataset.starRating, 10));
  };

  const onMouseLeavesStar = () => {
    setTempStars(null);
  };

  const onStarClick = ({ currentTarget }) => {
    if (!editable) {
      return;
    }

    setTempStars(null);
    setCake((c) => ({
      ...c,
      yumFactor: parseInt(currentTarget.dataset.starRating, 10),
    }));
  };

  const YumFactor = () => {
    const yumfactor = tempStars === null ? cake.yumFactor || 0 : tempStars;
    const stars = Array(yumfactor)
      .fill(Star);
    const emptyStars = Array(5 - yumfactor)
      .fill(StarBorder);
    return (
      <div>
        {stars.concat(emptyStars)
          .map((StarIcon, index) => (
            <StarIcon
              // eslint-disable-next-line react/no-array-index-key
              key={`star-${index}`}
              htmlColor="yellow"
              onMouseEnter={onMouseEntersStar}
              onMouseLeave={onMouseLeavesStar}
              onClick={onStarClick}
              data-star-rating={index + 1}
            />
          ))}
      </div>
    );
  };

  const fetchCake = async (id) => {
    setError(false);
    setLoading(true);
    setImageLoaded(false);
    try {
      const response = await loadCake(id);
      setCake(response);
      setImageLoaded(false);
      if (!response) {
        setError('loading');
      }
    } catch (e) {
      setError('loading');
    }
    setLoading(false);
  };

  const removeCake = async () => {
    setError(false);
    if (cake.id) {
      setLoading(true);
      try {
        await deleteCake(cake.id);
        history.push('/');
      } catch (e) {
        setError('deleting');
      }
    }
    setLoading(false);
  };

  const cancelEdit = () => {
    if (cakeId) {
      setEditable(false);
      fetchCake(cakeId);
    } else {
      history.push('/');
    }
  };

  const saveCake = async () => {
    setEditable(false);
    setLoading(true);
    try {
      if (cake.id) {
        const response = await updateCake(cake.id, cake);
        setCake(response);
      } else {
        const response = await addCake(cake);
        setCake(response);
        history.replace(`/${response.id}`);
      }
    } catch (e) {
      setError('saving');
    }
    setLoading(false);
  };

  const updateCakeValues = ({ target: { value, name } }) => {
    if (!editable) {
      return;
    }
    if (name === 'imageUrl') {
      setImageLoaded(false);
    }
    setCake((c) => ({
      ...c,
      [name]: value,
    }));
  };

  const onImageLoaded = () => setImageLoaded(true);

  useEffect(() => {
    const { id } = cake || {};
    if (cakeId && parseInt(cakeId, 10) === id) {
      return;
    }

    if (cakeId) {
      fetchCake(cakeId);
      setEditable(false);
    } else {
      setCake(emptyCake);
      setEditable(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cakeId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (<div>{`Sorry there was an error ${error} the cake`}</div>);
  }

  return (
    <article className={classes.root}>
      {!imageLoaded && <div className={classes['image-placeholder']}><HelpOutline /></div>}
      <img
        className={imageLoaded ? '' : classes['hide-image']}
        src={cake.imageUrl}
        alt={cake.name}
        onLoad={onImageLoaded}
      />
      <form className={classes.form}>
        <TextField
          value={cake.name}
          label="Cake Name"
          inputProps={{
            readOnly: !editable,
            'data-testid': 'name-input',
          }}
          onChange={updateCakeValues}
          name="name"
        />
        <TextField
          value={cake.comment}
          label="Comment"
          inputProps={{
            readOnly: !editable,
            'data-testid': 'comment-input',
          }}
          onChange={updateCakeValues}
          multiline
          rows={4}
          name="comment"
        />
        <TextField
          value={cake.imageUrl}
          label="Image URL"
          inputProps={{
            readOnly: !editable,
            'data-testid': 'imageUrl-input',
          }}
          onChange={updateCakeValues}
          name="imageUrl"
        />
        <YumFactor />
        <div className={classes['button-bar']}>
          <Button variant="contained" onClick={() => history.push('/')}>Back</Button>
          {!editable && (
            <div className={classes['button-group']}>
              <Button variant="contained" onClick={() => setEditable(true)}>Edit</Button>
              <Button variant="contained" onClick={removeCake}>Delete</Button>
            </div>
          )}
          {editable && (
            <div className={classes['button-group']}>
              <Button variant="contained" onClick={cancelEdit}>Cancel</Button>
              <Button variant="contained" color="primary" onClick={saveCake}>Save</Button>
            </div>
          )}
        </div>
      </form>
    </article>
  );
};
