import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Col from "react-bootstrap/Col";
import Row from 'react-bootstrap/Row';
export default function AuthorStats({
    authorBounties
})


{
    const getTotalBounties = () => {
        var arr = [];
        if (authorBounties === null) {
          return arr;
        }
        for (let i = 0; i < authorBounties.length; i++) {
        //   arr[i] = new Date(authorBounties[i].gen_time * 1000).toLocaleDateString("en-US");
        // @TODO: work on actual time later
            arr[i] = new Date().toLocaleDateString("en-US");
        }
      
        var dateCounts = {};
        var runningTotal = 0;
        for (let i = 0; i < arr.length; i++) {
            // console.log('timedad', arr[i]);
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
    const getCountOfClosed = () => {
        if (authorBounties === null) {
            return authorBounties;
        }
        var arr = [];
        for (let i = 0; i < authorBounties.length; i++) {
            arr[i] = { "date": new Date(authorBounties[i].gen_time * 1000).toLocaleDateString("en-US"), "passed": (!authorBounties[i].open) };
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
        console.log(result)
        return result;
    }
    
    if (authorBounties === null){
        return authorBounties;
    } else {
        // console.log('here this is it');
        var openBounts = getTotalBounties()
        console.log('test', openBounts)
        var TotalBounts = openBounts.length ? openBounts[openBounts.length - 1]['count'] : 0
        var closedBounts = getCountOfClosed()
        var totalClosedBounts = closedBounts.length ? closedBounts[closedBounts.length - 1]['amount'] : 0
    }
    return (
        <>
            <Row className="align-items-center">
                    <Col className="text-center" fluid="true" md={{ span: 4, offset: 4}} >
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
            </Row>
            <Row className="align-items-center"> 
                < span className="square border border-2">
                    <Col className="text-center" fluid="true" md={{ span: 4, offset: 4 }}>
                        <h2>Percent of Articles Closed : {Math.round(totalClosedBounts/TotalBounts* 100)}%</h2>
                             
                    </Col>
                </span>
            </Row>
            <Row className="align-items-center" style={{display: 'flex', justifyContent: 'center'}}>  
                <span className="square border border-2">
                    <Col className="text-center" fluid="true" md={{ span: 4, offset: 4 }}>
                        <h2>Number of Open Articles: {TotalBounts - totalClosedBounts}</h2>   
                    </Col>
                </span>
            </Row>
            <Row className="align-items-center">
                    <Col className="text-center" fluid="true" md={{ span: 4, offset: 4 }}>
                        <h2>Total Articles Closed</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                width={500}
                                height={300}
                                data={getCountOfClosed()}
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
        </>
    )
}