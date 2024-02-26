import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Col from "react-bootstrap/Col";
import Row from 'react-bootstrap/Row';
export default function EditorStats({
    editorBounties
})

{
    console.log(editorBounties)
    const getCountOfEditors = () => {
        if (editorBounties === null) {
            return editorBounties;
        }
        var arr = [];
        for (let i = 0; i < editorBounties.length; i++) {
            arr[i] = { "date": new Date(editorBounties[i].gen_time * 1000).toLocaleDateString("en-US"), "passed": editorBounties[i].review_links.length };
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
    const getTotalTokens = () => {
        var arr = [];
        if (editorBounties === null) {
            return arr;
        }
        for (let i = 0; i < editorBounties.length; i++) {
            var temp = { "date": new Date(editorBounties[i].gen_time * 1000).toLocaleDateString("en-US"), "amount": editorBounties[i].amount };
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

    if (editorBounties === null){
        return editorBounties;
    } else {
        var reviewCount = getCountOfEditors()
        // var Totalreviews = reviewCount[reviewCount.length - 1]['amount']
        var Totalreviews = reviewCount.length ? reviewCount[reviewCount.length - 1]['amount'] : 0

        var tokensCount = getTotalTokens()
        // var totalTokens = tokensCount[tokensCount.length - 1]['amount']
        var totalTokens = tokensCount.length ? tokensCount[tokensCount.length - 1]['amount'] : 0

    }
    return(
        <>
                    <Row className="align-items-center">
                    <Col className="text-center" fluid="true" md={{ span: 4, offset: 4}}>
                        <h2>Total Edits</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                width={500}
                                height={300}
                                data={getCountOfEditors()}
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
                        <h2>Average Tokens Per Edit: {totalTokens / Totalreviews}</h2>   
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