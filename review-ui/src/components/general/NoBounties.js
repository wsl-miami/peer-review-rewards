import React from "react";
import Row from "react-bootstrap/Row";

class NoBounties extends React.Component {
    constructor(props) {
        super(props);
        this.generateContent = this.generateContent.bind(this);
    }

    generateContent() {
        if (this.props.type === "reviewer") {
            return (
                <>
                    <Row
                        className="text-center"
                        style={{ "margin-top": "10%" }}
                    >
                        <h1>Not Assigned to Review Any articles!</h1>
                        <h3> You must be assigned a article from the editor of the article. Once you are assinged a article they will be displayed here.</h3>
                    </Row>
                </>
            );
        }

        else if (this.props.type === "editor") {
            return (
                <>
                    <Row
                        className="text-center"
                        style={{ "margin-top": "10%" }}
                    >
                        <h1> Not Assigned to Edit Any Articles!</h1>
                        <h3> You must be assigned a article from the author of the article. Once you are assinged a article they will be displayed here.</h3>
                    </Row>
                </>
            );
        }

        else if (this.props.type === "author") {
            return (
                <>
                    <Row
                        className="text-center"
                        style={{ "margin-top": "10%" }}
                    >
                        <h1> No Authored Articles!</h1>
                        <h3> You must click on the "Open a Article" button in the top right to create a new article. Once finshed, your authored articles will be displayed here.</h3>
                    </Row>
                </>
            );
        }
    }
    render() {
        return (
            <>{this.generateContent()}</>
        )
    }
}

export default NoBounties;