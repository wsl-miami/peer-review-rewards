import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Col from "react-bootstrap/Col";
import Row from 'react-bootstrap/Row';
export default function ReviewerStats({
    reviewerBounties
})

{
    const getCountOfReviewers = () => {
        if (reviewerBounties === null) {
            return reviewerBounties;
        }
        // console.log(reviewerBounties[0].length)
        var arr = [];
        for (let i = 0; i < reviewerBounties.length; i++) {
            arr[i] = { "date": new Date(reviewerBounties[i].gen_time * 1000).toLocaleDateString("en-US"), "passed": reviewerBounties[i].reviewers.length };
        }
        console.log(arr)
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
    const getTotalTokens = () => {
        var arr = [];
        if (reviewerBounties === null) {
            return arr;
        }
        for (let i = 0; i < reviewerBounties.length; i++) {
            var temp = { "date": new Date(reviewerBounties[i].gen_time * 1000).toLocaleDateString("en-US"), "amount": reviewerBounties[i].amount };
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

    if (reviewerBounties === null){
        return reviewerBounties;
    } else {
        var reviewCount = getCountOfReviewers()
        var Totalreviews = reviewCount.length ? reviewCount[reviewCount.length - 1]['amount'] : 0
        var tokensCount = getTotalTokens()
        var totalTokens = tokensCount.length ? tokensCount[tokensCount.length - 1]['amount'] : 0
    }
    return (
    <>
            <Row className="align-items-center">
                    <Col className="text-center" fluid="true" md={{ span: 4, offset: 4 }}>
                        <h2>Total Reviewers</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                width={500}
                                height={300}
                                data={getCountOfReviewers()}
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
            <Row className="align-items-center"> 
                <span className="square border border-2">
                    <Col className="text-center" fluid="true" md={{ span: 4, offset: 4 }}>
                        <h2>Average Tokens Per Review: {(totalTokens / Totalreviews).toFixed(2)}</h2>   
                    </Col>
                </span>
            </Row>
            <Row className="align-items-center">
                    <Col className="text-center" fluid="true" md={{ span: 4, offset: 4 }}>
                        <h2>Total Tokens</h2>
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
    
    
    
    
    
    
    
    </>
)
}