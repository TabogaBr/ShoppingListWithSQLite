import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function App() {

  const db = SQLite.openDatabase('shoppingdb.db');

  const [data, setData] = useState([]);
  const [key, setKey] = useState(0);
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists shoppingList (id integer primary key not null, product text, amount text);');
    }, null, updateList);
  }, []);

  const saveItem = () => {
    db.transaction(tx => {
      tx.executeSql('insert into shoppingList (product, amount) values (?, ?);',
        [product, amount]);
    }, null, updateList)
    setProduct('');
    setAmount('');
    setKey(key + 1);
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from shoppingList;', [], (_, { rows }) =>
        setData(rows._array)
      );
    }, null, null);
  }

  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql('delete from shoppingList where id = ?;', [id]);
      }, null, updateList)
  }

  return (
    <View style={styles.container}>
      <TextInput style={[styles.textinputs, styles.margins, styles.textTop]}
        placeholder="Product"
        onChangeText={product => setProduct(product)}
        value={product} />
      <TextInput style={[styles.textinputs, styles.margins]}
        placeholder="Amount"
        onChangeText={amount => setAmount(amount)}
        value={amount}
      />
      <Button onPress={saveItem} title=" SAVE " />
      <FlatList contentContainerStyle={styles.items}
        keyExtractor={item => item.id.toString()}
        style={styles.list}
        data={data}
        renderItem={({ item }) =>
          <View style={styles.listcontainer}>
            <Text style={styles.item}>{item.product}, {item.amount} </Text>
            <Text style={[{ color: '#0000ff' }, styles.item]} onPress={() => deleteItem(item.id)}>bought</Text>
          </View>}
        ListHeaderComponent={<Text style={styles.title} > Shopping List </Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  textinputs: {
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
  },
  margins: {
    margin: '3%',
  },
  list: {
    paddingVertical: '5%',
  },
  textTop: {
    marginTop: 100,
  },
  items: {
    alignItems: 'center',
  },
  title: {
    color: 'blue',
    fontSize: 18,
  },
  item: {
    fontSize: 16,
    margin: '2%',
  },
  listcontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
