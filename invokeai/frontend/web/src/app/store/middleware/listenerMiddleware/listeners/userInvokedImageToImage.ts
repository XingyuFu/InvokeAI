import { startAppListening } from '..';
import { buildImageToImageGraph } from 'features/nodes/util/graphBuilders/buildImageToImageGraph';
import { sessionCreated } from 'services/thunks/session';
import { log } from 'app/logging/useLogger';
import { imageToImageGraphBuilt } from 'features/nodes/store/actions';
import { userInvoked } from 'app/store/actions';

const moduleLog = log.child({ namespace: 'invoke' });

export const addUserInvokedImageToImageListener = () => {
  startAppListening({
    predicate: (action): action is ReturnType<typeof userInvoked> =>
      userInvoked.match(action) && action.payload === 'image',
    effect: (action, { getState, dispatch }) => {
      const state = getState();

      const graph = buildImageToImageGraph(state);
      dispatch(imageToImageGraphBuilt(graph));
      moduleLog({ data: graph }, 'Image to Image graph built');

      dispatch(sessionCreated({ graph }));
    },
  });
};
