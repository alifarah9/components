const MIN_SWIPE_DISTANCE = 50;
const MIN_SWIPE_VELOCITY = 0.1;

const getSwipeVelocity = (start, end) => {
  const timePassed = end.time - start.time;

  if (swipedLeftToRight(start, end)) {
    return (end.x - start.x) / timePassed;
  } else if (swipedRightToLeft(start, end)) {
    return (start.x - end.x) / timePassed;
  }

  return 0;
};

const getSwipeDifference = (start, end) => {
  if (swipedLeftToRight(start, end)) {
    return end.x - start.x;
  } else if (swipedRightToLeft(start, end)) {
    return start.x - end.x;
  }
  return 0;
};

const swipedSignificantDistance = difference => Math.abs(difference) > MIN_SWIPE_DISTANCE;

const swipedWithSignificantVelocity = velocity => velocity > MIN_SWIPE_VELOCITY;

export const swipedLeftToRight = (start, end) => {
  return end.x > start.x;
};

export const swipedRightToLeft = (start, end) => {
  return start.x > end.x;
};

export const swipeShouldChangeTab = (start, end) => {
  const difference = getSwipeDifference(start, end);
  const velocity = getSwipeVelocity(start, end);

  return swipedSignificantDistance(difference) && swipedWithSignificantVelocity(velocity);
};
