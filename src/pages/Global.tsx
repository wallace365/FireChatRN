import { Alert, Keyboard, Platform, StatusBar, Modal, StyleSheet, Text, TextInput, KeyboardAvoidingView, SafeAreaView, View, Button, TouchableOpacity, FlatList } from 'react-native'
import Message from '../components/Message'
import {db} from '../Firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { addDoc, query, collection, orderBy, getDocs } from 'firebase/firestore'
import {useState, useEffect, useContext} from 'react'
import InputArea from '../components/Input'
import List from '../components/List'
import UserContext from '../../Context'

export default function Global(props:any) {
	const messagesRef = query(collection(db, 'global'), orderBy('timestamp'))
	const [messages] = useCollectionData(messagesRef)
	const [name, setName, loginstate, setLoginstate, uid] = useContext(UserContext) 
	const [currmessage, setCurrmessage] = useState('')

	console.log(name, uid, loginstate)

	const login = () => {
		props.navigation.navigate('Login')
	}

	const send = (text:string) => {
		text != "" && name != "" && uid != "" ? 
		addDoc(collection(db, 'global'), {
			user: name,
			uid: uid,
			message: text,
			reacts: 0,
			timestamp: new Date(),
			replies: ''
		}) : console.log(text)
		setCurrmessage("")
	}

	const renderItem = ({ item }:any) => (
		<Message  name={item.user} text={item.message} owned={item.uid == uid ? true : false} />
	)

	return (
		<SafeAreaView style={styles.body}>
			<StatusBar barStyle='light-content' />
			<View style={[styles.main]}>
				<List styles={styles} messages={messages} renderItem={renderItem}/>
			</View>
			<InputArea styles={styles} currmessage={currmessage} send={send} login={login} loginstate={loginstate} setCurrmessage={setCurrmessage}/>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({

	blackText: {
		color: 'black',
	},

	body: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		height: '100%',
	},

	list: {
		flex: 1,
		flexDirection: 'column',
		width: '100%',
		padding: 20,
		paddingTop: 0,
		paddingBottom: 20,
	},

	main: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-end',
		alignItems: 'flex-start',
		width: '100%',
	},

	whitetext: {
		color: 'white',
	}
})
