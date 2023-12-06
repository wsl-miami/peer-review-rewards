import React, { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Row from 'react-bootstrap/Row';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import bigLogo from '../../static/derpLogoBig.png';
import Container from 'react-bootstrap/Container';
// const oracledb = require('oracledb');


export default function AuthorDashboard({
    PRContract
}) {
    const [bounties, setBounties] = useState(null);
    useEffect(() => {
        console.log("here");
        if (PRContract) {
            console.log("then here");
            getBounties() 
                .then(data =>
                    setBounties(data)
                );
        }
    }, [PRContract]);

    const getBounties = async () => {
        const ret = (await PRContract.methods.allManuscripts().call());
        console.log('bounties', ret);
        return (ret);
    }

    const getTotalBounties = () => {
        var arr = [];
        if (bounties === null) {
          return arr;
        }
        for (let i = 0; i < bounties.length; i++) {
        // @TODO: Sort this out later
        //   arr[i] = new Date(bounties[i].gen_time * 1000).toLocaleDateString("en-US");
          arr[i] = new Date().toLocaleDateString("en-US");
        }
      
        var dateCounts = {};
        var runningTotal = 0;
      
        for (let i = 0; i < arr.length; i++) {
          const date = new Date(arr[i]).toISOString().slice(0, 10);
          const count = (dateCounts[date] || 0) + 1 + runningTotal;
          dateCounts[date] = count;
          runningTotal = count;
        }
      
        const result = Object.entries(dateCounts).map(([date, count]) => {
          return { date, count };
        });
      
        return result;
      }

    const getTotalTokens = () => {
        var arr = [];
        if (bounties === null) {
            return arr;
        }
        for (let i = 0; i < bounties.length; i++) {
            var temp = { "date": new Date(bounties[i].gen_time * 1000).toLocaleDateString("en-US"), "amount": bounties[i].amount };
            arr[i] = temp;
        }
        
        const dateAmounts = {};
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            const row = arr[i];
            const date = row.date;
            const amount = row.amount;
            sum += Number(amount);
            dateAmounts[date] = sum;
        }
        
        const result = Object.entries(dateAmounts).map(([date, amount]) => {
            return { date, amount };
        });
        
        return result;
    }
    const getCountOfReviews = () => {
        if (bounties === null) {
            return bounties;
        }
        var arr = [];
        for (let i = 0; i < bounties.length; i++) {
            arr[i] = { "date": new Date(bounties[i].gen_time * 1000).toLocaleDateString("en-US"), "passed": bounties[i].review_links.length };
        }
        
        var dateAmounts = {};
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            const row = arr[i];
            const date = row.date;
            const passed = row.passed;
            sum += Number(passed);
            dateAmounts[date] = sum;
        }
        
        const result = Object.entries(dateAmounts).map(([date, amount]) => {
            return { date, amount };
        });
        return result;
    }

    const DataFormater = (number) => {
        if(number > 1000000000){
          return (number/1000000000).toString() + 'B';
        }else if(number > 1000000){
          return (number/1000000).toString() + 'M';
        }else if(number > 1000){
          return (number/1000).toString() + 'K';
        }else{
          return number.toString();
        }
      }
    const intro_text = 'From 2 professors and 5 students at Miami University, the DERP is aimed to democratize and provide efficiency to all forms of science.';

    const rewards_text = 'Peer-Review rewards system is a platform to reward reviewers for their contributions to the academic research community.'
    const team_members_and_citations =
        <>
            <ul>
                <li>Dr. Bhunia: Advisor</li>
                <li>Dr. Carvalho: Advisor</li>
                <li>Caleb Anderson: Product Owner</li>
                <li>Will Keune: Scrum Master</li>
                <li>Noah Von Holle: Developer</li>
                <li>Joe Alcini: Developer</li>
                <li>Michael Hershberg: Developer</li>
            </ul>
        </>
    const config = { displayModeBar: false }
    return (

        <div>
            <Container fluid>
                <Row className='text-center align-items-center'>
                    <div>
                        <img
                            alt=""
                            src={bigLogo}
                            width="500"
                            height="300"
                        />
                    </div>
                </Row>
                <Row
                    className='text-center align-items-center'
                >
                    <h2>Peer Review Rewards</h2>
                </Row>
                <Row className='align-items-center'>
                    <Col md={{ span: 4, offset: 2 }}>
                        <h4>{rewards_text}</h4>
                    </Col>
                    <Col className="text-center" md={{ span: 4 }}>
                        <h2>Tokens Over Time</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                width={500}
                                height={300}
                                data={getTotalTokens()}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis tickFormatter={DataFormater}/>
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Col>
                </Row>
                <Row className="align-items-center">
                    <Col className="text-center" fluid="true" md={{ span: 4, offset: 2 }}>
                        <h2>Total Articles</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                width={500}
                                height={300}
                                data={getTotalBounties()}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Col>
                    <Col md={{ span: 4 }}>
                        <h3>Team Members:</h3>
                        <h4>{team_members_and_citations}</h4>
                    </Col>
                </Row>
                <Row className='text-center'>
                    <Col fluid="true" md={{ span: 4, offset: 2 }}>
                        <h3>Our Inspiration</h3>
                        <ul>
                            <li>
                                <a
                                    target="_blank"
                                    href="https://aisel.aisnet.org/cais/vol42/iss1/28/"
                                >
                                    Peer Review: Toward a Blockchain-enabled Market-based Ecosystem
                                </a>
                            </li>
                            <li>
                                <a
                                    target="_blank"
                                    href="https://scholarspace.manoa.hawaii.edu/server/api/core/bitstreams/f67443e9-96d2-40e7-8675-aff625526c7b/content"
                                >
                                    Towards a Decentralized Process for Scientific Publication and Peer Review using Blockchain and IPFS
                                </a>
                            </li>
                        </ul>
                    </Col>
                    <Col className="text-center" fluid="true" md={{ span: 4 }}>
                        <h2>Total Reviews</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                width={500}
                                height={300}
                                data={getCountOfReviews()}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}