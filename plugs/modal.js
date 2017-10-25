import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';


export default class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        };
        
      /*
        const { modalName } = this.props;
        const { closeModal } = this.props;
        const { saveBtn } = this.props;
        console.log(closeModal);
        */
    }
	componentDidMount() {
 		this.renderLayer();
 	}
 		
 	componentDidUpdate() {
 		this.renderLayer();
 	}
 		
 	componentWillUnmount() {
 		this.unrenderLayer();
 	}
 	
 	unrenderLayer() {
 		if(!this.layer){
 			return;
 		}
 		unmountComponentAtNode(this.layer); //销毁指定容器内的所有React节点
 		document.body.removeChild(this.layer);
 		this.layer=null;
 	}
 	renderLayer() {//自定义渲染
 		if(!open){
 			this.unrenderLayer()//卸载
 			return;
 		}
 		if(!this.layer){
 			this.layer=document.createElemnt('div');
 			document.body.appendChild(this.container);
 		}
 		unstable_renderSubtreeIntoContainer(this,this.props.children,this.layer)
 	}

  render() {
    
    const modalName = this.props.modalName;
    //const {closeModal} = this.props.closeModal;
    const saveBtn = this.props.saveBtn;

    const modTitle = this.props.modTitle;
    const modBody = this.props.modBody;
    
    //console.log(modalName);
    //console.log(closeModal);
    //console.log(saveBtn);
    //console.log(modBody);
    
    return (

        <div className="modal fade" id={'vmiModal'+ modalName} tabIndex="-1" role="dialog"  aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                        <h3 className="modal-title">{modTitle}</h3>
                    </div>
                    <div className="modal-body">
                        {/*<p>VMI popup info:</p>*/}
                        <p  dangerouslySetInnerHTML={{__html: modBody}}></p>
                        {/*<modBody />*/}
                        
                        
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                        <button type="button" onClick={saveBtn} className="btn btn-primary">Save</button>
                    </div>
                </div>
            </div>
        </div>




      
    )
  }
}



