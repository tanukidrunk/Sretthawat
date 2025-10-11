// styles.js
import { StyleSheet } from "react-native";
   
export const globalStyles = StyleSheet.create({
  // ---------- TOP BAR ----------
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#000",
  },
  adminText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  // ---------- CATEGORY SECTION ----------
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 25,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    marginVertical: 10,
    width: "70%",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#000",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },

  // ---------- PROFILE MODAL ----------
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingTop: 60,
    paddingRight: 10,
  },
  menuContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    width: 150,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
    color: "red",
    fontWeight: "bold",
  },
});
