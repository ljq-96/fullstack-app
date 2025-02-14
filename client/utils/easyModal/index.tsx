import React, { useEffect, useContext, useReducer, useCallback } from 'react';
import { EASY_MODAL_HOC_TYPE, EASY_MODAL_ID, MODAL_REGISTRY, getUid, isValidEasyHOC } from './utils';
import {
  EasyModalItem,
  EasyModalHOC,
  innerDispatch,
  EasyModalAction,
  ModalPromise,
  ModalResolveType,
  ModalProps,
  BuildFnInterfaceCheck,
  ModalComProps,
} from './type';

export * from './type';

const ModalContext = React.createContext<EasyModalItem[]>([]);
const ModalIdContext = React.createContext<string | null>(null);

let dispatch: innerDispatch = () => {
  throw new Error('No dispatch method detected, did you embed your app with EasyModal.Provider?');
};

function reducer<P, V>(state: EasyModalItem<P, V>[], action: EasyModalAction<P, V>): EasyModalItem<P, V>[] {
  switch (action.type) {
    case 'easy_modal/show': {
      const { id } = action.payload;
      const newState = [...state];
      const index = newState.findIndex((v) => v.id === id);

      if (index > -1) {
        newState[index] = {
          ...newState[index],
          ...action.payload,
          open: true,
        };
      } else {
        newState.push({
          ...newState[index],
          ...action.payload,
          open: true,
        });
      }

      return newState;
    }
    case 'easy_modal/hide': {
      const { id } = action.payload;
      const newState = [...state];
      const index = newState.findIndex((v) => v.id === id);

      newState[index] = {
        ...newState[index],
        ...action.payload,
        open: false,
      };

      return newState;
    }
    case 'easy_modal/remove': {
      const { id } = action.payload;
      const newState = [...state];
      const index = newState.findIndex((v) => v.id === id);
      newState.splice(index, 1);

      return newState;
    }
    default:
      return state;
  }
}

function showModal<P = any, V = any>(
  id: string,
  props: ModalProps<P, V>,
  promise: ModalPromise<V>,
  config: EasyModalItem<P, V>['config'],
): EasyModalAction {
  return {
    type: 'easy_modal/show',
    payload: {
      id,
      props,
      promise,
      config,
    },
  };
}

function hideModal(id: string): EasyModalAction {
  return {
    type: 'easy_modal/hide',
    payload: {
      id,
    },
  };
}

function removeModal(id: string): EasyModalAction {
  return {
    type: 'easy_modal/remove',
    payload: {
      id,
    },
  };
}

const getModalId = <P, V>(Modal: EasyModalHOC<P, V> | string): string => {
  if (typeof Modal === 'string') return Modal as string;

  if (!Modal[EASY_MODAL_ID]) Modal[EASY_MODAL_ID] = getUid();

  return Modal[EASY_MODAL_ID]!;
};

function findModal<P, V>(Modal: EasyModalHOC<P, V> | string) {
  if (typeof Modal === 'string' && MODAL_REGISTRY[Modal]) {
    return MODAL_REGISTRY[Modal].Component;
  }

  const find = Object.values(MODAL_REGISTRY).find((item) => item.Component === (Modal as EasyModalHOC<P, V>));

  return find ? find.Component : void 0;
}

function create<P extends ModalProps<P, V>, V = ModalResolveType<P>>(
  Comp: React.ComponentType<ModalComProps<P, V>>,
): EasyModalHOC<P, V> {
  if (!Comp) new Error('Please pass in the react component.');
  const EasyModalHOCWrapper: EasyModalHOC<P, V> = ({ id: modalId }) => {
    const modal = useModal(modalId);
    const { id, config } = modal;

    useEffect(() => {
      return () => {
        config?.removeOnHide && delete MODAL_REGISTRY[id];
      };
    }, [id, config?.removeOnHide]);

    return (
      <ModalIdContext.Provider value={id}>
        <Comp {...(modal as any)} />
      </ModalIdContext.Provider>
    );
  };

  EasyModalHOCWrapper.__typeof_easy_modal__ = EASY_MODAL_HOC_TYPE;

  return EasyModalHOCWrapper;
}

function register<P, V>(id: string, Modal: EasyModalHOC<P, V>, props: ModalProps<P, V>) {
  if (!MODAL_REGISTRY[id]) {
    MODAL_REGISTRY[id] = { Component: Modal, props };
  }
}

function show<P extends ModalProps<P, V>, V = ModalResolveType<P>>(
  Modal: EasyModalHOC<P, V>,
  props: ModalProps<P, V>,
  config: EasyModalItem<P, V>['config'] = {
    removeOnHide: false,
    resolveOnHide: false,
  },
) {
  // Check & Create
  const _Modal = (isValidEasyHOC(Modal) ? Modal : create<P, V>(Modal as React.ComponentType<any>)) as EasyModalHOC<
    P,
    V
  >; /* `as` tell ts that _Modal's type */

  // Find & Register
  const id = getModalId<P, V>(_Modal);
  const find = findModal<P, V>(_Modal) ?? findModal<P, V>(id);
  if (!find) register<P, V>(id, _Modal, props);

  // Promise Control
  // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator
  let theResolve!: BuildFnInterfaceCheck<V>;
  let theReject!: (reason: any) => void; //Reject any, forever.

  const promise = new Promise<V>((resolve, reject) => {
    theResolve = resolve as typeof theResolve;
    theReject = reject;
  });

  const modalPromise: ModalPromise<V> = {
    resolve: theResolve,
    reject: theReject,
  };

  dispatch<P, V>(showModal<P, V>(id, props, modalPromise, config));
  /* Think Return More */
  return promise;
}

function hide<P, V>(Modal: EasyModalHOC<P, V> | string) {
  const id = getModalId<P, V>(Modal);
  if (!id) throw new Error('No id found in EasyModal.hide.');
  dispatch<P, V>(hideModal(id));
}

function remove<P, V>(Modal: EasyModalHOC<P, V> | string) {
  const id = getModalId<P, V>(Modal);
  if (!id) throw new Error('No id found in EasyModal.remove.');
  dispatch<P, V>(removeModal(id));
  delete MODAL_REGISTRY[id];
}

export function useModal<P extends ModalProps<P, V>, V = ModalResolveType<P>>(id?: string): ModalComProps<P, V> {
  const modals = useContext(ModalContext);
  const contextModalId = useContext(ModalIdContext);

  if (!id) id = contextModalId as string;
  if (!id) throw new Error('No modal id found in EasyModal.useModal.');

  const modalInfo = modals.find((t) => t.id === id) as EasyModalItem<P, V>;
  if (!modalInfo) throw new Error('No modalInfo found in EasyModal.useModal.');

  const { promise, config, ...reset } = modalInfo as EasyModalItem<P, V>;

  const modalId: string = id;

  const hideCallback: BuildFnInterfaceCheck<V> = useCallback(
    (result?: V | null) => {
      hide(modalId);
      config?.removeOnHide && remove(modalId);
      config?.resolveOnHide && promise?.resolve(result as any); // TypeScript can only infer the type at runtime.
    },
    [modalId, promise, config?.removeOnHide, config?.resolveOnHide],
  );

  const removeCallback = useCallback(() => {
    remove(modalId);
  }, [modalId]);

  return {
    hide: hideCallback,
    remove: removeCallback,
    ...promise,
    ...modalInfo,
  };
}

const EasyModalPlaceholder: React.FC = () => {
  const modals = useContext(ModalContext);

  const openModals = modals.filter(
    (item) => !!item.open || !item?.config?.removeOnHide /* If you do not want to destroy, keep on the tree */,
  );

  const toRender = openModals.map((item) => {
    return {
      id: item.id,
      Component: MODAL_REGISTRY[item.id].Component,
    };
  });

  return (
    <>
      {toRender.map((item) => (
        //! Render HOC & Just Inject Id
        <item.Component key={item.id} id={item.id} />
      ))}
    </>
  );
};

const Provider: React.FC<Record<string, any>> = ({ children }) => {
  const arr = useReducer(reducer, []);
  const modals = arr[0];
  function innerDispatch<P, V>(action: EasyModalAction<P, V>) {
    (arr[1] as React.Dispatch<EasyModalAction<P, V>>)(action);
  }
  dispatch = innerDispatch;

  return (
    <ModalContext.Provider value={modals}>
      {children}
      <EasyModalPlaceholder />
    </ModalContext.Provider>
  );
};

const EasyModal = {
  Provider,
  ModalContext,
  create,
  show,
  hide,
  remove,
  useModal,
};

export default EasyModal;
