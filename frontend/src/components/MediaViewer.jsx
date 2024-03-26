import { useContext, useState, useRef, useEffect } from "react";

import { AppContext } from "../appContext";
import img1 from "../assets/images/posts/background05.jpeg";

function MediaViewer({mediaViewer, setMediaViewer}){
	const { prefix, itemList, currentIndex } = mediaViewer;
	const [localCurrentIndex, setLocalCurrentIndex] = useState(currentIndex);

	const mediaViewerRef = useRef(null);
	const mediaViewerCloseBtnRef = useRef(null);

	const context = useContext(AppContext);
	const { baseUrl } = context;

	function isFirstItem(_index){
		if(_index === 0){
			return true;
		}
		return false;
	}

	function isLastItem(_list, _index){
		if((_index + 1) === _list.length){
			return true;
		}
		return false;
	}

	function prevItem(){
		if(!itemList.length > 1){
			return;
		}

		// localCurrentIndex === 0
		if(isFirstItem(localCurrentIndex)){
			return;
		}

		setLocalCurrentIndex(prev => prev - 1);
	}

	function nextItem(){
		if(!itemList.length > 1){
			return;
		}

		// last index
		if(isLastItem(itemList, localCurrentIndex)){
			return;
		}

		setLocalCurrentIndex(prev => prev + 1);
	}

	function closeMediaViewer(){
		setMediaViewer(prev => {
			return { ...prev, state: false }
		});
	}

	function clickOutsideMediaViewer(event){
		if(!mediaViewerRef.current.contains(event.target)){
			closeMediaViewer();
			document.removeEventListener("mousedown", clickOutsideMediaViewer);
		}
		if(mediaViewerCloseBtnRef.current.contains(event.target)){
			document.removeEventListener("mousedown", clickOutsideMediaViewer);
		}
	}

	useEffect(() => {
		document.addEventListener("mousedown", clickOutsideMediaViewer);
	}, []);

	return <div className="content-viewer" ref={mediaViewerRef}>
					<div className="position-relative">

						<span className="media-viewer--close cursor-pointer"
							onClick={closeMediaViewer} ref={mediaViewerCloseBtnRef}>
								X
						</span>

						<span className="media-viewer--index">
							{ localCurrentIndex + 1 + "/" + itemList.length }
						</span>

						{ !isFirstItem(localCurrentIndex) && <span className="media-viewer--prev">
							<button className="link-like-btn text-white" onClick={prevItem}>&lt;</button>
						</span> }

						<img className="w-100" src={baseUrl + "/" + prefix + "/" + itemList[localCurrentIndex]}/>

						{ !isLastItem(itemList, localCurrentIndex) && <span className="media-viewer--next">
							<button className="link-like-btn text-white" onClick={nextItem}>&gt;</button>
						</span> }
					</div>
				</div>
}

export default MediaViewer;
