import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeee',
  },
  list: {
    padding: 4,
  },
  header: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  btn: {
    margin: 4,
    alignSelf: 'baseline',
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },
  btnTitle: {
    margin: 4,
    color: '#fff',
    fontSize: 12,
  },
  groupView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexGrow: 1,
    margin: 4,
    marginTop: 10,
    paddingTop: 10,
    borderRadius: 4,
    borderColor: '#4c4c4c66',
    borderWidth: 1,
  },
  groupViewTitle: {
    position: 'absolute',
    backgroundColor: '#eeee',
    paddingHorizontal: 4,
    height: 20,
    top: 0,
    left: '4%',
    transform: [{translateY: -11}],
  },
  lyItem: {
    flexDirection: 'row',
  },
  itemBrands: {
    marginHorizontal: 16,
  },
  date: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 10,
    color: '#EF6C00',
    textAlignVertical: 'center',
    paddingTop: 1,
  },
});
