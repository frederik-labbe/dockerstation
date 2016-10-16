function startBridge(domain, port) {
    var exampleSocket = new WebSocket('ws://' + domain + ':' + port, 'echo-protocol');

    exampleSocket.onopen = function (event) {
        console.log('Connected to Docker!');
    };

    exampleSocket.onmessage = function (event) {
        var message = JSON.parse(event.data);

        switch (message.type) {
            case 'imagesUpdate':
                if (_e('image_list') == null) break;
            
                if (_e('image_list').innerHTML == '') {
                    var listElement = _e('image_list');
                
                    listElement.innerHTML = '';
                    var dockerImages = message.value;
                    
                    dockerImages.forEach(function(image) {
                        var imageLi = _c('li');
                        imageLi.appendChild(
                            document.createTextNode(image.REPOSITORY)
                        );
                        listElement.appendChild(imageLi);
                    });
                }
                break;

            case 'psUpdate':
                if (_e('image_list') == null) break;
            
                var interv = window.setInterval(function() {
                    if (_e('image_list').innerHTML != '') {
                        window.clearInterval(interv);
                        
                        var imagesContainersId = {};
                        var imagesContainersFriendlyName = {};
                        var dockerContainers = message.value;
                        
                        dockerContainers.forEach(function(container) {
                            var id = container['CONTAINER ID'];
                            if (typeof imagesContainersId[container.IMAGE] == "undefined") {
                                imagesContainersId[container.IMAGE] = [id];
                            } else {
                                imagesContainersId[container.IMAGE].push(id);
                            }
                            
                            var friendlyName = id + ' => ' + container['NAMES'];
                            if (typeof imagesContainersFriendlyName[container.IMAGE] == "undefined") {
                                imagesContainersFriendlyName[container.IMAGE] = [friendlyName];
                            } else {
                                imagesContainersFriendlyName[container.IMAGE].push(friendlyName);
                            }
                        });
                        
                        Array.from(_e('image_list').getElementsByTagName('li')).forEach(function(imageElement) {
                            var containerList = _c('div');
                            containerList.class = 'container-list';
                            
                            var friendlyNames = typeof imagesContainersFriendlyName[imageElement.innerHTML] == "undefined" ? [] : imagesContainersFriendlyName[imageElement.innerHTML];
                            friendlyNames.forEach(function(containerName, containerIndex) {
                                var containerLi = _c('li');
                                var containerLink = _c('a');
                                containerLink.href = '/console/' + imagesContainersId[imageElement.innerHTML][containerIndex];
                                containerLink.target = '_blank';
                                containerLink.innerHTML = containerName;
                                containerLi.appendChild(containerLink);
                                containerList.appendChild(containerLi);
                            });
                            imageElement.appendChild(containerList);
                        });
                    }
                }, 1);
                break;
        }
    }

    exampleSocket.onerror = function (event) {
      console.log('Error while trying to connect to Docker. Is the bridge running ?');
    };
}
