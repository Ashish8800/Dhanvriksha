import { useRef, useState } from "react";

// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Switch from "react-switch";
// component
import Iconify from "../../../components/Iconify";
import * as Yup from "yup";
import AreaDialog from "../../../components/AreaDialog";
// ----------------------------------------------------------------------

export default function AreaMoreMenu(props) {
  const ref = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  function handleClose() {
    setIsOpen(false);
    setEditMode(false);
  }

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      {editMode && (
        <AreaDialog
          setLoading={props.setLoading}
          data={props.data}
          getAreaData={props.getAreaData}
          editMode={true}
          openDialog={true}
          handleClose={handleClose}
        />
      )}
      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: "100%" },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {/* <MenuItem sx={{ color: "text.secondary" }}>
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary="Delete"
            primaryTypographyProps={{ variant: "body2" }}
          />
        </MenuItem> */}

        <MenuItem sx={{ color: "text.secondary" }}>
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary="Edit"
            onClick={() => {
              setEditMode(true);
            }}
            primaryTypographyProps={{ variant: "body2" }}
          />
         
        </MenuItem>
      </Menu>
    </>
  );
}
