"use client";

import { content } from "@/lib/content";
import { Dialog } from "./Dialog";
import { Enquiry } from "./Enquiry";

/** The enquiry in a dialog, opened by "Check availability" anywhere on the page. */
export default function EnquiryDialog({ onClose }: { onClose: () => void }) {
  return (
    <Dialog title={content.story.enquiry.modalTitle} onClose={onClose} closeLabel={content.story.film.close}>
      <Enquiry context="modal" />
    </Dialog>
  );
}
