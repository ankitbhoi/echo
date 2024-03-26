import React, {useEffect, useState} from 'react';
import AddRoomModel from '../../components/AddRoomModel/AddRoomModel';
import RoomCard from '../../components/RoomCard/RoomCard';
import { getAllRooms } from '../../http';
import styles from './Rooms.module.css';

const Rooms = () => {

  const [showModel, setShowModel] = useState(false);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const {data} = await getAllRooms();
      setRooms(data);
    }
    fetchRooms();
  }, []);
  

  function openModel(){
    setShowModel(true);
  }
  return (
    <>
      <div className='container'>
        <div className={styles.roomsHeader}>
          <div className={styles.left}>
            <span className={styles.heading}>All voice rooms</span>
            <div className={styles.searchBox}>
              <img src="/images/search-icon.png" alt="search" />
              <input type="text" className={styles.searchInput} />
            </div>
          </div>
          <div className={styles.right}>
            <button onClick={openModel} className={styles.startRoomButton}>
              <img src="/images/add-room-icon.png" alt="add-room" />
              <span>Start a room</span>
            </button>
          </div>
        </div>
        <div className={styles.roomList}>
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room}/>
          ))}
        </div>
      </div>
      {showModel && <AddRoomModel onClose={() => setShowModel(false)} />}
    </>
  )
}

export default Rooms