import { types, Instance } from 'mobx-state-tree';

const Award = types.model('Award', {
  id: types.identifier,
  count: types.number,
  name: types.string,
  imageUrl: types.string
});

export default Award;
export interface IAward extends Instance<typeof Award> {}
