import { Avatar, Card, CardHeader } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchUser } from "../../redux/Auth/auth.action";
import { createChat } from "../../redux/Message/message.action";

const SearchUser = () => {
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  const { message, auth } = useSelector((store) => store);

  const handleSearchUser = (e) => {
    setUsername(e.target.value);
    console.log("Search user");
    dispatch(searchUser(username));
  };

  const handleClick = (id) => {
    dispatch(createChat({ userId: id }));
    console.log(id);
  };

  return (
    <div>
      <div className="py-5 relative">
        <input
          className="bg-transparent border border-[#3b4054] outline-none w-full px-5 py-3 rounded-full"
          placeholder="search user..."
          type="text"
          onChange={handleSearchUser}
        />
        {username &&
          auth.searchUser.map((item) => (
            <Card
              key={item.id}
              className="absolute w-full z-10 top-[4.5rem] cursor-pointer"
            >
              <CardHeader
                onClick={() => {
                  handleClick();
                  setUsername("");
                }}
                avatar={
                  <Avatar src="https://media.discordapp.net/attachments/1234639385459429507/1271491219586945054/image.png?ex=67c08579&is=67bf33f9&hm=b6dfdcc758697b062d3bff532d2288efcc04680b00c4188633be3529023b768b&=&format=webp&quality=lossless&width=756&height=320" />
                }
                title={item.firstName + " " + item.lastName}
                subheader={
                  item.firstName.toLowerCase() +
                  "_" +
                  item.lastName.toLowerCase()
                }
              />
            </Card>
          ))}
      </div>
    </div>
  );
};

export default SearchUser;
