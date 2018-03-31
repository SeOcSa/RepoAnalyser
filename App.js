
import React, { Component } from 'react';
import {StyleSheet, View, TextInput, Image, Text, TouchableOpacity, Alert,FlatList
} from 'react-native';
import Comment from './Components/Comment/Comment';

type Props = {};
export default class App extends Component<Props> {
    constructor(props) {
        super(props);
        this.state= { repoOwner: "", repoName:"" , isLoading: true, hasData: true,
            numberOfAuthors:0, numberOfCommits: 0, numberOfEntities: 0, commitInfo: [], commentsString: ''};
    }

   async fetchCommitsAndCommitsComments(){
        let path = 'https://api.github.com/repos/' +
            this.state.repoOwner + '/' + this.state.repoName + '/commits?page=1&per_page=100';
        let data = [];
        fetch(path)
            .then((response) => response.json())
            .then((jsonResponse)=>  {
                console.log(jsonResponse);
                jsonResponse.map( (commitObject) => {
                    var item = new AuthorInfo(
                        commitObject.author.id,
                        commitObject.author.login,
                        commitObject.author.avatar_url,
                        commitObject.commit.message
                    );
                    data.push(item);
                    });
                this.setState({isLoading: false});
            })
            .catch((error) => console.log(error));

        this.setState({commitInfo: data});
    }

    async fetchNumberOfAuthors(){
        var pageCounter=1;
        this.setState({numberOfAuthors: 0, hasData:true});
        while(true) {
            if(this.state.hasData == false) break;

            var path = 'https://api.github.com/repos/'
                + this.state.repoOwner + '/' + this.state.repoName + '/contributors?page='+pageCounter+'&per_page=100';
            pageCounter++;

           await fetch(path)
                .then((response) => response.json())
                .then((jsonResponse) => {
                    if(jsonResponse.length == 0) {
                        this.setState({hasData: false});
                    }

                    this.setState({numberOfAuthors: this.state.numberOfAuthors + jsonResponse.length});
                })
                .catch((error) => console.log(error));
        }
    }

    fetchNumberOfEntities(url, counter){
        var entityCounter= 0 + counter;

        fetch(url).then((response) => response.json())
            .then((jsonResponse) => {
                jsonResponse.map((entity) =>{
                    if(entity.type == 'dir')
                        this.fetchNumberOfEntities(entity.url, entityCounter);
                    else
                        entityCounter++;
                });
                this.setState({numberOfEntities: entityCounter});
            });

        return entityCounter;
    }

    showComments() {
        var commentsString='';
        this.state.commitInfo.map((comment) =>{
            commentsString = commentsString + comment+'\n';
        });

        this.setState({commentsString: commentsString});

        console.log(this.state.commitInfo);
    }

    async analyzeRepo(){
        if(this.state.repoOwner =='' || this.state.repoName =='') {
            Alert.alert('Error',
                'Repo Owner or repo name is not filled in!',
                [
                    {text: 'OK'}
                ],
                {cancelable: false});
            return;
        }

        await this.fetchCommitsAndCommitsComments();

        this.showComments();

        //await this.fetchNumberOfAuthors();

        Alert.alert(
            'Result',
            'Number of Authors:' + this.state.numberOfAuthors+'\n'+
            'Number of Commits:' + this.state.numberOfCommits,
            [
                {text: 'OK'},
            ],
            { cancelable: false }
        )


    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image
                        style={styles.logo}
                        source={require('./images/githubIcon.png')}
                    />
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Repository owner"
                    autoCorrect={ false}
                    onChangeText={(repoOwner) => {this.setState({repoOwner: repoOwner})}}
                    autoCapitalize={'none'}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Repository name"
                    autoCorrect={ false}
                    onChangeText={(repoName) => this.setState({repoName: repoName})}
                    autoCapitalize={'none'}
                />
                <TouchableOpacity style={styles.buttonContainer}
                                  onPress={() => this.analyzeRepo()}>
                    <Text style={styles.buttonText}>
                        Analyse
                    </Text>
                </TouchableOpacity>
                <Text style={styles.labelStyle}> Comments: </Text>
                <FlatList
                    data={this.state.commitInfo}
                    renderItem={({item}) =>
                        <Comment authorAvatarUri={item.avatarUri} authorName={item.userName}
                                 commitMessage={item.message}/>}
                />
            </View>
        );
    }
}

class AuthorInfo{
    userId:string;
    userName: string;
    avatarUri: string;
    message: string;

    constructor(userId: string, userName:string, avatarUri:string, message: string) {
        this.userId= userId;
        this.userName= userName;
        this.avatarUri = avatarUri;
        this.message= message;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#006266'
    },
    input: {
        height: 40,
        backgroundColor: '#f5f6fa',
        marginBottom: 10,
        color: "#273c75",
        paddingHorizontal: 10,
        borderRadius:10,
        width: 250,
    },
    logo: {
        marginTop:20,
        width: 180,
        height:180
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    buttonContainer: {
        backgroundColor: '#d1d8e0',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: 100

    },
    textInputStyle:{
        marginTop:10,
        backgroundColor: '#d1d8e0',
        borderRadius: 10,
        fontSize: 14,
        color:'#fa8231',
        alignItems: 'center',
        borderWidth:1,
        width:350,
        height: 150
    },
    labelStyle:{
        marginTop:10,
        fontSize: 14,
        color: '#d1d8e0',
        alignSelf: 'flex-start',
        fontWeight: 'bold'
    }
});
