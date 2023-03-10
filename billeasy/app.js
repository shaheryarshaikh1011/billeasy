const express = require("express");
const app = express();
const bodyParser     =require("body-parser")
app.use(bodyParser.urlencoded({extended:true}));
//required to use env file
require('dotenv').config();
//uncomment below line to use on localhost
//const pool = require("./db");

//for heroku postgressql connection 
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    ssl: false
  }
});

pool.connect();

app.use(express.json()) //req.body


//routes//

//to get all department details
app.get("/api/dept",async (req,res)=>{
    try{
        const alldept = await pool.query("SELECT * FROM dept");
        res.json(alldept.rows);
    }
    catch(err)
    {
        console.log(err.message);
    }
})

//to get all employee details
app.get("/api/emp",async (req,res)=>{
    try{
        const allemp = await pool.query("SELECT * FROM emp");
        res.json(allemp.rows);
    }
    catch(err)
    {
        console.log(err.message);
    }
})


//to get data about specific employee
app.get("/api/alldata/:id",async(req,res)=>
{
    try{
        const {id} = req.params;
        const alldata = await pool.query("SELECT emp_id, emp_name, emp_gender, emp_location, emp_doj, dept_name FROM dept INNER JOIN emp ON dept_id = emp_deptid WHERE emp_id=$1",[id]);
        res.json(alldata.rows[0]);
    }
    catch(err)
    {
        console.error(err.message);
    }
})

app.get("/api/emp/:date",async(req,res)=>{
    
    values=[
        data.start_date=req.body.start_date,
        data.end_date=req.body.end_date
    ]
    try{
        const datedata=await pool.query("execute procedure return_emp($1,$2)",values)
        res.json(datedata);
    }
    catch(err){
        console.log()
    }
})

app.get("/selectall",async(req,res)=>{
    const data=await pool.query("select * from dept");
    res.json(data);
})

// create a department data
app.post("/api/dept", async(req,res)=>{    
    // Grab data from http request
    const data = {
        dept_id: req.body.dept_id,
        dept_name: req.body.dept_name,

    };
    console.log(req.body.dept_id);

    const values = [
        data.dept_id,
        data.dept_name
    ];
    
    try{
         
        
         const newdept = await pool.query("INSERT INTO dept (dept_id,dept_name) VALUES ($1,$2) RETURNING *",
         values
         );
         

         res.json(newdept.rows[0]);
    }
    catch(err)
    {
        console.log(err.message);
    }
})

// create employeee data
app.post("/api/emp", async(req,res)=>{    
    // Grab data from http request
    const data = {
        emp_id: req.body.emp_id,
        emp_age: req.body.emp_age,
        emp_name: req.body.emp_name,
        emp_gender: req.body.emp_gender,
        emp_deptid: req.body.emp_deptid,
        emp_location:req.body.emp_location,
        emp_doj:Date.now(),

    };
    
    const values = [
        data.emp_id, 
        data.emp_age, 
        data.emp_name, 
        data.emp_gender, 
        data.emp_deptid, 
        data.emp_location,
        data.emp_doj
    ];
    
    try{
         
         const newemp = await pool.query("INSERT INTO emp (emp_id,emp_age,emp_name,emp_gender,emp_deptid,emp_location,emp_doj) VALUES ($1,$2,$3,$4,$5,$6,(to_timestamp($7 / 1000.0))) RETURNING *",
         values
         );
         
         

         res.json(newemp.rows[0]);
         
    }
    catch(err)
    {
        console.log(err.message);
    }
})


app.get("/api/numbers",async(req,res)=>
{
    values=[
        numbers=req.body.numbers,
        size=req.body.size,
        k=req.body.k
    ]
    function subsetPairNotDivisibleByK(arr,N,K)
    {
        // Array for storing frequency of modulo
        // values
        let f = new Array(K);
        for(let i=0;i<K;i++)
        {
            f[i]=0;
        }
        // Fill frequency array with values modulo K
        for (let i = 0; i < N; i++)
            f[arr[i] % K]++;
       
        // if K is even, then update f[K/2]
        if (K % 2 == 0)
            f[K/2] = Math.min(f[K/2], 1);
       
        // Initialize result by minimum of 1 or
        // count of numbers giving remainder 0
        let result = Math.min(f[0], 1);
       
        // Choose maximum of count of numbers
        // giving remainder i or K-i
        for (let i = 1; i <= K/2; i++)
            result += Math.max(f[i], f[K-i]);
       
        return result;
    }
    res.send(subsetPairNotDivisibleByK( values.numbers, values.size, values.k));

})


var server_port = process.env.YOUR_PORT || process.env.PORT || 3000;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
app.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});