async function fetchDataAndUpdateContent() {
    try {
      const response = await fetch(`https://${window.location.href.split("/")[2]}:9038/device-info`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      document.getElementById('siteName').textContent = "Home - " + data.displayName;
      document.getElementById('welcomeToServerName').textContent = data.hostName;
      document.getElementById('deviceModalIP').textContent = data.networking.ip;
      document.getElementById('deviceModalSearchDomain').textContent = data.networking.searchDomain;
  
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

fetchDataAndUpdateContent();