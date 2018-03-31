import React, { Component } from 'react';
import {StyleSheet, View, Image, Text
} from 'react-native';

export default class Comment extends Component{
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.authorInfoContainer}>
                    <Image style={styles.logo}
                            source={{uri: this.props.authorAvatarUri}}/>
                    <View style={styles.infoContainer}>
                        <Text style={styles.nameStyle}>User Name: {this.props.authorName}</Text>
                    </View>
                </View>
                <View style={styles.messageContainer}>
                    <Text style={styles.label}>Message</Text>
                    <Text numberOfLines={5} style={styles.infoStyle}>{this.props.commitMessage}</Text>
                </View>
            </View>
        )
    }
}

styles= StyleSheet.create({
    container:{
        marginTop:10,
        flexDirection: 'column',
        backgroundColor: '#2f3640',
        width:350,
        height:170,
        borderRadius:20
    },
    authorInfoContainer:{
        marginTop:5,
        marginLeft:20,
        marginLeft:20,
        flexDirection: 'row'
    },
    infoContainer:{
        marginTop:10,
        width:250,
        borderRadius:5
    },
    nameStyle:{
        fontWeight: 'bold',
        fontSize:14,
        color: "white"
    },
    infoStyle:{
        fontWeight: 'bold',
        fontSize:11,
        alignSelf:'flex-start'
    },
    label:{
        fontSize:16
    },
    logo: {
        marginRight:10,
        alignSelf: 'flex-start',
        width: 60,
        height:60,
        borderRadius:30,
    },
    messageContainer:{
        marginLeft: 10,
        marginRight:10,
        backgroundColor:"#dcdde1",
        borderRadius:5,
        alignItems:'center',
        height:90,
        marginTop:2
    }
});