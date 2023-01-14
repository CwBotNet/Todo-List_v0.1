const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash');
const { response } = require("express");
const { add } = require("lodash");
const date = require(__dirname + '/date.js') // created own date module 



const app = express();
const port = 8080;
const todoTasks = [];
const work = [];
const day = date.getDate();

// database user name and pass

const userName = 'cwrsahani';
const passWord = 'f2Hssfs4Uj6gXHu'

mongoose.set('strictQuery', true);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true })); // using body-parse for html data fetching
app.use(express.static("public")); // use to load css file in server

//connecting mongodb to server
mongoose.connect(`mongodb+srv://${userName}:${passWord}@mflix.hvalqhe.mongodb.net/todolistDB`);


// creating a new schema for todalistDb
const itemsSchema = new Schema({
    name: String
})

// creating model for data entry

const Item = mongoose.model('Item', itemsSchema);


// add a single item in server 
const task = new Item({
    name: 'test'
});


// adding data

const item1 = new Item({
    name: 'Welcom to MY ToDo-LiSt'
});

const item2 = new Item({
    name: 'For adding task click + icon'
})
const item3 = new Item({
    name: '<-- Hit this to delete a task'
})

const defaultTask = [item1, item2, item3]

const listSchema = new Schema({
    name: String,
    list: [itemsSchema]
});

const List = mongoose.model('List', listSchema);


app.get("/", (req, res) => {



    // ---> important 
    Item.find({}, (err, foundItems) => {
        if (foundItems.length === 0) {
            Item.insertMany(defaultTask, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('successfully inserted');
                }
            });
            res.redirect('/');
        } else {
            res.render('index', { listTitle: day, listTask: foundItems });
        }
    })

});

// request params express method
app.get('/:customListName', (req, res) => {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName }, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                // create new list 
                const list = new List({
                    name: customListName,
                    list: defaultTask
                })

                list.save();

                res.redirect('/' + customListName);

            } else {
                // show exesting list

                res.render('index', { listTitle: foundList.name, listTask: foundList.list });

            }
        }
    })


})

// post data form client site to server

app.post('/', (req, res) => {

    const listName = (req.body.list);
    const newTask = _.capitalize(req.body.newTasks);

    const addTask = new Item({
        name: newTask
    });


    if (listName === day) {
        addTask.save();
        res.redirect('/');
    } else {
        List.findOne({ name: listName }, (err, foundList) => {
            foundList.list.push(addTask);
            foundList.save();
            res.redirect('/' + listName);
        })
    }

})



app.post('/delete', (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === day) {
        
        // ----> another method <----
        
        Item.findByIdAndRemove(checkedItemId, (err) => {
            if (!err) {
                // console.log(`this id ${checkedItemId} item is deleted.`);
            }
        })
        res.redirect('/');
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { list: { _id: checkedItemId } } }, (err, foundList) => {
            if (!err) {
                res.redirect('/' + listName);
            }
        })
    }

})


app.listen(port, (req, res) => {
    console.log(`connected to ${port}.`);
});