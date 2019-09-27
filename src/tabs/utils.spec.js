import {
  swipedLeftToRight,
  swipedRightToLeft,
  getSwipeDifference,
  swipeShouldChangeTab,
} from './utils';

describe('Tabs Utility', () => {
  let start;
  let end;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when the ending x axis is greater than the starting x axis', () => {
    beforeEach(() => {
      start = { x: 0, time: 1569538800000 };
      end = { x: 50, time: 1569538800300 };
    });

    it('determines that the swipe was left to right', () => {
      expect(swipedLeftToRight(start, end)).toBe(true);
      expect(swipedRightToLeft(start, end)).toBe(false);
    });

    it('calculates the correct swipe difference', () => {
      expect(getSwipeDifference(start, end)).toBe(50);
    });
  });

  describe('when the ending x axis is less than the starting x axis', () => {
    beforeEach(() => {
      start = { x: 50, time: 1569538800000 };
      end = { x: 0, time: 1569538800300 };
    });

    it('determines that the swipe was right to left', () => {
      expect(swipedRightToLeft(start, end)).toBe(true);
      expect(swipedLeftToRight(start, end)).toBe(false);
    });

    it('calculates the correct swipe difference', () => {
      expect(getSwipeDifference(start, end)).toBe(50);
    });
  });

  describe('checking if a swipe should change tabs', () => {
    it('should change tab when the difference and velocity are significant', () => {
      start = { x: 0, time: 1569538800000 };
      end = { x: 100, time: 1569538800001 };
      expect(swipeShouldChangeTab(start, end)).toBe(true);
    });

    it('should not change tab when the difference is small', () => {
      start = { x: 0, time: 1569538800000 };
      end = { x: 1, time: 1569538800001 };
      expect(swipeShouldChangeTab(start, end)).toBe(false);
    });

    it('should not change tab when the velocity is small', () => {
      start = { x: 0, time: 1569538800000 };
      end = { x: 100, time: 1569538900000 };
      expect(swipeShouldChangeTab(start, end)).toBe(false);
    });
  });
});
