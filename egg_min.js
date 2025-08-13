const eggs=[{id:1,name:"Medium Eggs",icon:"egg",description:"53-63g per egg. Versatile size for everyday cooking."},{id:2,name:"Large Eggs",icon:"egg",description:"63-73g per egg. Standard size for most recipes."},{id:3,name:"Quail Eggs",icon:"egg",description:"9-10g per egg. Delicate and rich, great for appetizers."},{id:4,name:"Free Range Medium",icon:"egg",description:"Medium eggs from free-range chickens. Better taste and nutrition."},{id:5,name:"Free Range Large",icon:"egg",description:"Large eggs from free-range chickens. Premium quality for all uses."}];document.addEventListener('DOMContentLoaded',()=>{const eggList=document.getElementById('eggList');const reportModal=document.getElementById('reportModal');const closeModal=document.getElementById('closeModal');const cancelBtn=document.getElementById('cancelBtn');const generateReport=document.getElementById('generateReport');const sendEmailBtn=document.getElementById('sendEmailBtn');const sendAllBtn=document.getElementById('sendAllBtn');const reportList=document.getElementById('reportList');const emailForm=document.getElementById('emailForm');const searchInput=document.getElementById('searchInput');const notification=document.getElementById('notification');function renderEggList(eggsArray=eggs){eggList.innerHTML='';eggsArray.forEach(egg=>{const eggCard=document.createElement('div');eggCard.className='egg-card';eggCard.innerHTML=`
                        <div class="egg-header">
                            <h3 class="egg-name">
                                <i class="fas fa-${egg.icon} egg-icon"></i>
                                ${egg.name}
                            </h3>
                            <div class="egg-id">ID: ${egg.id}</div>
                        </div>
                        <div class="egg-info">
                            <p class="egg-description">${egg.description}</p>
                            <div class="quantity-control">
                                <span class="quantity-label">Boxes:</span>
                                <input type="number" min="0" class="quantity-input" id="egg-${egg.id}" placeholder="Enter amount">
                            </div>
                        </div>
                    `;eggList.appendChild(eggCard);});}
renderEggList();searchInput.addEventListener('input',(e)=>{const searchTerm=e.target.value.toLowerCase();const filteredEggs=eggs.filter(egg=>egg.name.toLowerCase().includes(searchTerm)||egg.description.toLowerCase().includes(searchTerm));renderEggList(filteredEggs);});function showReport(){reportList.innerHTML='';eggs.forEach(egg=>{const input=document.getElementById(`egg-${egg.id}`);let quantity='N/A';let quantityClass='';if(input.value.trim()!==''){const value=parseInt(input.value);if(!isNaN(value)){if(value===0){quantity='0';quantityClass='quantity-zero';}else{quantity=value===1?'1 box':`${value} boxes`;}}}
const reportItem=document.createElement('li');reportItem.className='report-item';reportItem.innerHTML=`
                        <span class="report-egg">${egg.name}</span>
                        <span class="report-quantity ${quantityClass}">${quantity}</span>
                    `;reportList.appendChild(reportItem);});reportModal.classList.add('show');}
generateReport.addEventListener('click',showReport);sendAllBtn.addEventListener('click',showReport);const closeModalFunc=()=>{reportModal.classList.remove('show');};closeModal.addEventListener('click',closeModalFunc);cancelBtn.addEventListener('click',closeModalFunc);function getInventoryList(){let inventoryList="";eggs.forEach(egg=>{const input=document.getElementById(`egg-${egg.id}`);let quantity='N/A';if(input.value.trim()!==''){const value=parseInt(input.value);if(!isNaN(value)){quantity=value===0?'0':(value===1?'1 box':`${value} boxes`);}}
inventoryList+=`${egg.name}: ${quantity}\n`;});return inventoryList;}
sendEmailBtn.addEventListener('click',(e)=>{e.preventDefault();if(emailForm.checkValidity()){const email=document.getElementById('email').value;const subject=document.getElementById('subject').value;const message=document.getElementById('message').value;const inventoryList=getInventoryList();const emailBody=encodeURIComponent(`${message}\n\n`+"EGG INVENTORY REPORT:\n"+"=====================\n\n"+
inventoryList);const mailtoLink=`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${emailBody}`;notification.classList.add('show');setTimeout(()=>{notification.classList.remove('show');},3000);window.location.href=mailtoLink;setTimeout(closeModalFunc,500);}else{alert('Please enter a valid email address');}});reportModal.addEventListener('click',(e)=>{if(e.target===reportModal){closeModalFunc();}});});