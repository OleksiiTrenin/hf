import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF', // Білий фон
    flexDirection: 'row',
  },
  sidebar: {
    width: 250, // Ширина бічної панелі
    backgroundColor: '#F9F9F9', // Світлий фон для панелі
    padding: 10,
    borderRightWidth: 1,
    borderColor: '#E0E0E0',
  },
  content: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: '#FFF', // Білий фон картки
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#F28C38', // Оранжевий акцент
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#F28C38', // Оранжевий акцент
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#F28C38', // Оранжевий акцент
  },
  select: {
    height: 40,
    width: '100%',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
    minimumTrackTintColor: '#F28C38', // Оранжевий трек
    maximumTrackTintColor: '#D3D3D3',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
});